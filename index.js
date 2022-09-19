
function TypeDefinition(description, constructor, consumer = () => {}) {
    const S = Symbol(description)
    Executables[S] = consumer
    return [constructor, (o,v=S)=>o[S]=v==S?o[S]:v]
}

const Executables = {}
const COMPOSED = Symbol.for("(st)composable")

function fn(funcName, factoryFunction, ...dependUnions) {
    if(typeof funcName == "string")
        Object.defineProperty(factoryFunction, "name", { value: funcName || "(st)fallbackFunctionName" })
    else {
        dependUnions.unshift(factoryFunction)
        factoryFunction = funcName
        funcName = factoryFunction.name || "(st)fallbackFunctionName"
    }
    
    // // DEBUG MODE
    // const st = eval(`({
    //     ["(st)${funcName}"](props) {
    //         utils.fallbackAssign(props, defaults)
    //         return factoryFunction(props, props)
    //     }
    // }["(st)${funcName}"])`)

    // // RELEASE MODE
    Object.defineProperty(st, "name", { value: funcName })

    const defaults = {}
    st[COMPOSED] = {}

    for (const propObj of dependUnions) 
    for (const [name, value] of utils.composeProps(propObj, st[COMPOSED])) 
    for (const S of Object.getOwnPropertySymbols(value)) 
        Executables[S]?.(name, defaults, value)
        
    return st

    function st(props) {
        utils.fallbackAssign(props, defaults)
        return factoryFunction(props, props)
    }
}

const utils = {
    composeProps(propObj, symbols) {
        // return Object.entries(propObj[COMPOSED] || propObj)
        const entries = []
        let props = propObj
        if(COMPOSED in propObj) 
            props = propObj[COMPOSED]
        else 
            for (const key in Object.getOwnPropertySymbols(props))
                entries.push([key, symbols[key] = props[key]])
        
        for (const key in props) 
            entries.push([key, symbols[key] = props[key]])
            
        return entries
    },
    fallbackAssign(target, source) {
        for (const key in source)
            if(!(key in target))
                target[key] = source[key]
        return target
    },
    capitalize(string = "") {
        const s = string[0].toUpperCase()
        return `${s}${string.substr(1)}`
    }
}

const [declareProps, getSetSymProps] = TypeDefinition("(st)declareProps", 
    (manyPropDefs = {}) => {
        const outObj = {}
        for (const propKey in manyPropDefs) {
            let propDef = {}
            if(!getSetSymFall(manyPropDefs[propKey])) 
                getSetSymProps(propDef, manyPropDefs[propKey])
            else propDef = manyPropDefs[propKey]
            
            outObj[utils.capitalize(propKey)] = { [propKey]: propDef }
        }
        return outObj
    },
    (propName, componentFallbackProps, propValue) => {
        
        if(getSetSymFall(propValue))
            componentFallbackProps[propName] = getSetSymProps(propValue)
        
    }
)
const [negate] = TypeDefinition("(st)negate", 
    (funcComposable = () => {}, manyPropDefs = {}) => {
        const outObj = Object.assign({}, funcComposable[COMPOSED])
        for (const name in manyPropDefs) 
            delete outObj[name]
        
        return outObj
    }
)
const [fallback, getSetSymFall] = TypeDefinition("(st)fallback", 
    (value) => { 
        const wrapper = {}
        getSetSymProps(wrapper, value)
        getSetSymFall(wrapper, true)
        return wrapper
    }
)
const [brand, getSetSymBrand] = TypeDefinition("(st)brand",
    (validator) => {
        const wrapper = {}
        getSetSymProps(wrapper, null)
        getSetSymBrand(wrapper, validator)
        return wrapper
    }
)
const asBrand = (funcObj, props) => {
    for (const key in funcObj) 
        return getSetSymBrand(getSetSymProps(funcObj[key]))(props)
}
const defineProp = (like, metadata) => metadata

export { 
    declareProps, 
    fallback as MOptional, 
    negate as MHide,
    brand as MClass,
    asBrand as MTry,
    defineProp as MCast,
    fn, 
    TypeDefinition 
}