/*
 * Create functions that have composable type inferencing.
 * 
 * We export three functions (fn, TypeDefinition, declareProps).
 * Whether client-side or server-side, use fn to create components.
 * Application developers will use declareProps to create prop types.
 * Library authors will use TypeDefinition to add runtime functionality to types.
 * We export five modifiers (MOptional, MHide, MClass, MTry, MCast).
 */

// global state used by ST

const Executables = {};
const ST = fn.symbol = Symbol("(st)composable");

// add function to executables

function TypeDefinition(description, constructor, consumer = () => {}) {
    const S = Symbol(description)
    Executables[S] = consumer
    constructor.symbol = S
    return [constructor, (o,v=S)=>v==S?o[S]:o[S]=v]
}

// decorate function using executables

function fn(funcName, factoryFunction, ...dependUnions) {
    if(typeof funcName == "string")
        Object.defineProperty(factoryFunction, "name", { value: funcName || "(st)fallbackFunctionName" })
    else {
        if(factoryFunction)
            dependUnions.unshift(factoryFunction)
        factoryFunction = funcName
        funcName = factoryFunction.name || "(st)fallbackFunctionName"
    }
    
    // // DEBUG MODE
    // const st = eval(`({
    //     ["(st)${funcName}"](props) {
    //         utilFallbackAssign(props, defaults)
    //         return factoryFunction(props, props)
    //     }
    // }["(st)${funcName}"])`)

    // // RELEASE MODE
    Object.defineProperty(st, "name", { value: funcName })

    const defaults = {}
    st[ST] = {}

    for (const propObj of dependUnions) 
    for (const [name, value] of utilComposeProps(propObj, st[ST])) 
    for (const S of Object.getOwnPropertySymbols(value)) 
        Executables[S]?.(name, defaults, value)
        
    return st

    function st(props) {
        utilFallbackAssign(props, defaults)
        return factoryFunction(props, props)
    }
}

// built-ins

const [Declare, inDeclare] = TypeDefinition("(st)declareProps", 
    (manyPropDefs = {}) => {
        const outObj = {};
        for (const [key, prop] of Object.entries(manyPropDefs)) {
            let propDef = inDeclare(prop);
            if(propDef !== undefined) propDef = prop;
            else propDef = utilFlatWrap(prop);
            
            outObj[utilCapitalize(key)] = { [key]: propDef };
        }
        return outObj;
    },
    (propName, componentFallbackProps, propValue) => {
        if(inFallback(propValue))
            componentFallbackProps[propName] = inDeclare(propValue);
    }
);
const [Negate] = TypeDefinition("(st)negate", 
    (funcComposable = () => {}, manyPropDefs = {}) => {
        const outObj = Object.assign({}, funcComposable[ST]);
        for (const name in manyPropDefs) 
            delete outObj[name];
        
        return outObj;
    }
);
const [Fallback, inFallback] = TypeDefinition("(st)fallback", 
    (value) => { 
        const wrapper = utilFlatWrap(value);
        inFallback(wrapper, true);
        return wrapper;
    }
);
const [Brand, inBrand] = TypeDefinition("(st)brand",
    (validator) => {
        const wrapper = utilFlatWrap(validator);
        inBrand(wrapper, true);
        return wrapper;
    }
);
const constructor = (funcObj, props) => {
    for (const key in funcObj) 
        if(inBrand(funcObj[key]))
            return inDeclare(funcObj[key])(props);
};
const [Legacy, inLegacy] = TypeDefinition("(st)legacy",
    (like, metadata) => {
        const wrapper = utilFlatWrap(like);
        inLegacy(wrapper, metadata);
        return wrapper;
    }
);

// exports

export { 
    Declare as declareProps, 
    Fallback as MOptional, 
    Negate as MHide,
    Brand as MClass,
    constructor as MTry,
    Legacy as MCast,
    fn, 
    TypeDefinition 
};

// utils

function utilFlatWrap(object) {
    if(inDeclare(object)) return object;

    const wrapper = {};
    inDeclare(wrapper, object);
    return wrapper;
}
function utilComposeProps(propObj, symbols) {
    const entries = [];
    let props = propObj;
    if(ST in propObj) 
        props = propObj[ST];
    else 
        for (const key of Object.getOwnPropertySymbols(props))
            entries.push([key, symbols[key] = props[key]]);
    
    for (const key in props) 
        entries.push([key, symbols[key] = props[key]]);
        
    return entries;
}
function utilFallbackAssign(target, source) {
    for (const key in source)
        if(!(key in target))
            target[key] = source[key];
    return target;
}
function utilCapitalize(string = "") {
    const s = string[0].toUpperCase();
    return `${s}${string.substr(1)}`;
}