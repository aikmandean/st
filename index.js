/*
 * Create functions that have composable type inferencing.
 * 
 * We export three functions (fn, TypeDefinition, defineProp).
 * Whether client-side or server-side, use fn to create components.
 * Application developers will use defineProp to create types.
 * Library authors will use TypeDefinition to add runtime functionality to types.
 */

// "Executables", holds custom type definitions that have runtime functionality.

const Executables = {};

// "fn", is defined in the preamble.

export function fn(func, data = {}) {
    // "symbols", collects the custom types to be written to "func".
    const symbols = {}
    // "defaults", is a custom type that comes out-of-the-box.
    const defaults = {}
    // "funcName", is a second built-in type.
    const funcName = func.name || data.fn || "(fn)fallbackFunctionName"

    for (const key in data) 
        if(data[key])
            for (const sym of Object.getOwnPropertySymbols(data[key]))
                if(typeof Executables[sym] == "function")
                    symbols[sym] = Executables[sym](
                        uncapitalize(key), 
                        defaults, 
                        data[key][sym], 
                        symbols[sym]
                    )
    
    // your input function is decorated so that it has a new name, default values, or other custom types.
    return (
        Object.assign(
            { [funcName]: (props = {}) => (
                fallbackAssign(props, defaults) 
                && func(props, props)) 
            } [funcName], 
            symbols))

    // this is the original implementation to apply custom types, but it doesn't support getter properties.
    return (
        Object.assign({ [funcName]: (props, _ = {}) => (
                Object.assign(
                    _, 
                    defaults, 
                    props) 
                && func(_, _)) 
            } [funcName], symbols))
}

// "TypeDefinition", is defined in the preamble.

export function TypeDefinition(constructor, consumer, description = "") {
    const S = Symbol(description);
    Executables[S] = consumer;
    return (
        Object.assign(
            function(...args) {
                return (
                    { [S]: 
                        constructor(...args) 
                    })
            }, 
        { symbol: S }))
}

// "defineProp", is defined in the preamble.

export const defineProp = TypeDefinition(
    (like, metadata = {}) => {
        metadata = Object.assign({}, metadata)
        if(metadata.default)
            metadata.default = like
        return metadata
    },
    (key, defaults, metadataList, existingList = []) => {
        if(!Array.isArray(metadataList)) metadataList = [{metadata: metadataList, key}]
        
        for (const {key, metadata} of metadataList) {
            if(metadata.default)
                defaults[key] = metadata.default
            existingList.push({ key, metadata })
        }
        return existingList
    }, "defineProp")

// "uncapitalize", helps differentiate between a type vs its correlating prop.

function uncapitalize(string = "") {
    const s = string[0].toLowerCase()
    return `${s}${string.substr(1)}`
}

// "fallbackAssign", helps support getter properties.

function fallbackAssign(target, source) {
    for (const key in source)
        if(!(key in target))
            target[key] = source[key]
    return target
}