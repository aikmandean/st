# st
What's st? The best way to pass state in your application. Front-end? Back-end? Yep, it's better using st.  
  
`npm i @hwyblvd/st`
  
It takes five minutes to pick it up, this is what to expect:
```js
import { FirstName, LastName } from "./my-types.js" // or .ts

const printCount = fn(props => {

    console.log(props.firstName) // string

    console.log(props.dateOfBirth) // error

}, FirstName, LastName)
```
It's the fastest way to share strong types throughout your code 
in JavaScript or TypeScript. Even TypeScript users get easier & stronger types. Our little library, st, is effortless to use but promises a big add.
1. Types in JavaScript - doesn't require default params
2. Add a comment to your type, everywhere it's used will have it too
3. Automatic editor renaming support
4. Add types together to be more concise (DRY)
5. Component-first (great for React)
  
| | |
---|---
| **Overview** | Start using ST, rewrite <br> less code, escape from globals.
| *Declaring <br> Props* | 🪴 **First JavaScript Walkthrough**
| | *A starter guide to authoring props.*
| &nbsp;<br>[5 min.](#commenting-throughout-your-codebase) | &nbsp;<br>**Commenting throughout your codebase**
| | *Comment once, document everywhere.*
| | *Props, comments, markdown.*
| &nbsp;<br>[10 min.](#letting-props-be-optional) | &nbsp;<br>**Letting props be optional**
| | *Basics of prop modifiers.*
| | *Using the `optional` modifier.*
| &nbsp;<br>[15 min.](#validating-a-prop-from-custom-rules) | &nbsp;<br>**Validating a prop from custom rules**
| | *How to use the `try` modifier for prop classes.*
| | *Writing your own prop class.*
| *Functions & <br> Components* | 🪴 **First JavaScript Walkthrough**
| | *A starter guide to writing functions.*
| | *The dependency list.*
| &nbsp;<br>[5 min.](#owning-react) | &nbsp;<br>**Owning React**
| | *A new way to add props to components.*
| | *Passing props using strongly-type spread syntax.*
| &nbsp;<br>[10 min.](#prop-shortcuts) | &nbsp;<br>**Prop Shortcuts**
| | *An advanced pattern to lighten the dependency list.*
| | *Composing dependencies from functions.*
| | *Using the `hide` modifier to uncompose.*
  
## Overview
What is st really? (it's `.ts` backwards) st is a type inference 
library; that means, "write less TS." We wanted less `any`, 
more safety. So how does it hold up? Here's an example of 
three TypeScript functions.
```ts
// TypeScript
// Before st
const printCount = (props: { count: number, time: Date }) => { /* ... */ }
const twiceCount = (props: { count: number, time: Date }) => { /* ... */ }
const countIsOdd = (props: { count: number, time: Date }) => { /* ... */ }
```
Typing our props this way isn't too bad, if we wanted to 
change type `number` to something else, like JavaScript's `BigInt`, that wouldn't be impossible. But st? It's easy.
```ts
// JS or TS
// After
import { fn } from "@hwyblvd/st"
import { Count, Time } from "./my-type"
const printCount = fn(props => { /* ... */ }, Count, Time)
const twiceCount = fn(props => { /* ... */ }, Count, Time)
const countIsOdd = fn(props => { /* ... */ }, Count, Time)
```
We hope it's so easy that you won't need globals or Context. But, you can always mix-n-match. 
Use the few simple tools in st to "write once, never rewrite."
  
Where are we declaring `Count` or `Time`?  
  
The next section explains. See how to [author your prop types](#first-javascript-prop-walkthrough), 
how [shared comments work](#commenting-throughout-your-codebase), or advanced [static type enforcement](#validating-a-prop-from-custom-rules).
  
## Declaring Props
### First JavaScript Prop Walkthrough
In the overview above, we replaced the TypeScript `props: { count: number }` 
using only `Count`. How did work?
  
Write your own prop types using `declareProps()`. To recreate our example, 
here's what we did.
```js
// my-type.js

export const { Count, Time } = declareProps({
    count: 0,
    time: new Date()
})
```
You can declare as many prop types as you want inside declareProps. 
When we wrote `count: 0`, that became `count: number` to TypeScript. 
This way, by writing passing `Count` to `fn()` vscode knows props 
has `.count` exactly how you would have written in TypeScript natively.
  
Here's a full example that you can copy/paste into a file.
```js
import { declareProps, fn } from "@hwyblvd/st"

const { FirstName, LastName } = declareProps({
    firstName: "",
    lastName: ""
})

const printName = fn(props => {

    console.log(props.firstName) // string, a first name
    
    console.log(props.dateOfBirth) // 🚩 static error: function doesn't have DateOfBirth

}, FirstName, LastName)
```
  
What is the `fn()` function, how does it know `.firstName` exists 
but `.dateOfBirth` does not? The section [functions & components](#first-javascript-function-walkthrough) explains.  
  
Next, we cover an easy-to-use, rewarding, feature for declaring props, 
[adding shared comments](#commenting-throughout-your-codebase).
  
### Commenting throughout your codebase
Shared comments are a top reason for st. Incredibly easy. 
Incredible payoff. Your props object knows the prop types 
you expect, property names - but also - it knows what comments 
you wrote when declaring a prop.
  
```js
const { Name } = declareProps({
    /** Future users of this code: This is a shoe brand name only! */
    name: ""
})

const logName = fn(props => {

    // when you hover over name it 
    // will show `type: string` but
    // also show the comment.
    console.log(props.name)

}, Name)
```
  
Shared comments work across files. It supports markdown. You can even 
add code examples in the comment that show in vscode.  
  
You can place most of your prop types in one file, document them all there, 
then get an easy overview of your program - while also getting in-editor 
documentation for each prop you use in any function in your entire codebase.
```js
// my-type.js
export const { Name, Age } = declareProps({
    /**
     * ### Shoe Brand Name
     * In our app, we 'track shoe sales cross country.'
     * But we only support a few brands, 'name' must be 
     * one of these:
     * @type {"Revstep"|"Safestride"|"Walker's"|"Canasta"}
     */
    name: ""
    /**
     * ### Company's Age
     * This is an odd one, if the number is even, the company 
     * is private. If not, it's public. See here:
     * ```js
     * if(props.age % 2) {
     *      console.log(props.name, "is a public corp")
     * }
     * ```
     */
    age: 0
})
```
  
The next sections cover two advanced features in st. First, [optional props](#letting-props-be-optional) make it easier to call functions or React 
Components. Second, [validated props](#validating-a-prop-from-custom-rules) 
make it harder, more strict, using TypeScript's branded types.  
  
You can skip these if you'd like, start writing [functions in st](#first-javascript-function-walkthrough) or jump to [React Components](#owning-react)
  
### Letting props be optional
Optional props is the first `modifier` you'll use. Until now, we 
declare firstName as a string like `firstName: ""`. You aren't required 
to use `""`, so `"hello world"` would also work. Usually, st ignores the exact 
string. We only gather its type. What if you want that exact string?
  
In st, we export modifier functions. They all start with captial M. `MOptional()` is a prop modifier. It 
marks a prop type as not required.
  
```js
// Before optional
const { Message } = declareProps({
    message: "Hello world" // <- not wrapped in MOptional
})

const printMessage = fn(props => console.log(props.message), Message)

printMessage({}) // 🚩 static error: Did not provide 'message'.
```
  
By adding the optional modifier, our error goes away. Our prop becomes 
optional. So, what if we don't provide it, will it be undefined? No. 
Let's see how to use `MOptional()` to learn how it avoids undefined.
  
```js
// After
const { SafeMessage } = declareProps({
    safeMessage: MOptional("Hello world")
})

const printMessage = fn(props => console.log(props.safeMessage), SafeMessage)

printMessage({}) // safeMessage defaulted to "Hello world"
```
  
Adding `MOptional` saves the value we use when declaring the prop. 
Then, if we don't pass the prop, it'll fall back to that value. 
Modifiers can loosen our props to make it easier, or tighten 
our props, adding validators. Use `MOptional()` **to make your 
function easier to call**.
  
What does it mean to make a function harder to call? 
Why might you do that? The next sections [covers `MClass()`](#validating-a-prop-from-custom-rules), an advanced 
feature to add specific validators, or rules, to your props.
  
### Validating a prop from custom rules
Built in, st has three modifiers. Prop validators are the most advanced 
to write in native TypeScript. This modifier lets you author "branded types". 
It's incredibly secure. Any prop from a validator had to explicitly be 
validated by your custom rule. Let's compare against a typical prop.
  
```js
const { Age, PrivateAge, PublicAge } = declareProps({
    /** 
     * ### Company's age
     * Maybe you'll find an even better way, but 
     * we track public companies using odd numbers,
     * otherwise it's private.
     */
    age: 0,
    /** *warn* PrivateAge must be even, but how can we validate this? */
    privateAge: 2,
    /** *warn* PublicAge must be odd, but how can we validate this? */
    publicAge: 1
})
```
  
In JavaScript, if we could pass `age` through a validator, we'd know if 
it's a `privateAge` or `publicAge`. Still, there's no guarantee that 
someone later passes a publicAge where we expect a privateAge. 
To st, both are plain numbers. Prop validators to the rescue.
  
Once you declare that a prop requires a validator, you won't 
be able to pass a `number` or `string` or any type directly to it. 
This is how the security guarantee operates.
  
```js
// Before validators
import { EvenNumber } from "./my-types.js"
import { printEven } from "./my-functions.js"

// Any function using evenNumber 
// could crash at runtime.

// No way of strictly validating 
// prop before it's passed in.

printEven({ evenNumber: 4 }) // no error
printEven({ evenNumber: 5 }) // ❌ crashes when ran!
```
  
In both cases above, we're passing the props directly. If 
`EvenNumber` has used a validator, **both cases would be TypeScript errors**.
Instead, `MTry()` upgrades normal types to validated props. 
To use it, pass the prop type, then the input data.  
   
In our example, let's say EvenNumber will accept `props: { anyNumber: number }`, 
but will only return `{ evenNumber: number }` if our number was even.
  
```js
// After
let evenNumber

// Now, printEvent 
// won't crash 🎉 
// We pushed the 'throwable' 
// code into MTry

try {
    evenNumber = MTry(EvenNumber, { anyNumber: 5 })
} catch(error) { 
    evenNumber = MTry(EvenNumber, { anyNumber: 2 })
}

printEvent({ evenNumber }) // <- evenNumber is always even at this point
```
  
When you use a validator, your functions won't throw! Only 
`MTry()` will throw. Functions that use validated props 
can pass them around - they won't need to revalidate. 
Prop validators create a hard border in your app, so prop errors 
won't come up inside your borders. How do you create a validator? 
`MClass()`.
  
```js
const { AnyNumber } = declareProps({
    /** Number may be even, possibly odd. */
    anyNumber: 0
})


const validateEven = fn(props => {
    if(props.anyNumber % 2) throw new Error(`Not even`)
    else return props.anyNumber
}, AnyNumber)

const { EvenNumber } = declareProps({
    /** 
     * This prop uses MClass() modifier. You  
     * won't be able to pass { evenNumber: 2 } 
     * directly. Use MTry() instead.
     */
    evenNumber: MClass(validateEven),
})
```
  
This is the last section covering declaring props in st. 


## Functions & Components
### First JavaScript Function Walkthrough
In the overview, we imported prop types, then 
passed them to `fn()`. What is fn used for? Why does st need it? 
Simply, fn always wraps when you write a function. Why? 
So st can figure out what props you ask for. For TypeScript developers, 
this practice is called Type Inference. Really, st is just a type inference 
helper. If inference is used well enough, you wouldn't need TypeScript at all. 
  
Here's a few examples using `fn()`, maybe we can infer what it's doing.
```js
import { FirstName, LastName } from "./my-types"

// A function that prints whatever
// first name is passed to it.
const printFirstName = fn(props => {

    console.log(props.firstName)

}, FirstName)

printFirstName({}) // 🚩 static error: 'firstName' missing

printFirstName({ dateOfBirth: '08-30-71' }) // 🚩 static error: 'firstName' missing

printFirstName({ firstName: 5 * 4 }) // 🚩 static error: 'firstName' is number, not string
```
  
So far, `fn()` looks like it takes two parameters. The first is 
what function we are writing, second is a prop type. The second 
param does something strange, it changes what type `props` is. 
When `FirstName` is our second param, `props.firstName` becomes 
available. However, our function also needs a `firstName` prop passed 
to it. All this is happening in our editor. It's part of st's fn() 
beside some powerful type inference behind the scenes.
  
In the overview, we say that `fn()` could take three parameters:
```js
// From the overview section
const printCount = fn(props => {/*...*/}, Count, Time)
```
How many parameters can fn take? No limit. It uses JavaScript's 
"rest parameters" to accept as many as you provide. Each param 
after the first (your function) adds a prop type to `props`.
  
Here's `printCount` in more detail:
```js
const printCount = fn(props => {

    console.log(props.count) // a number, whatever count you'll pass

    console.log(props.time) // a Date, specific to the prop you'll pass

}, Count, Time)

printCount({ count: 12, time: new Date() }) // 12, [object Date]
```
  
Things like `Count` or `Time` are called "prop types." When you put them 
as parameters to `fn()`, they augment your function's props object. All of 
the prop types you pass to fn() is called the "dependency list." You can 
see [Declaring Props](#first-javascript-prop-walkthrough) to learn how to 
create prop types. The next section covers [Components, React, JS spread syntax](#owning-react)
  
### Owning React
Unsurprisingly, st was designed for React. Functions you write take only 
one parameter - specifically a props object. Let's upgrade `printCount()` 
from before into a React component.
```jsx
const PrintCount = fn(props => {
    return (
        <p> 
            <b>Label</b>: {props.label}
            <b>Count</b>: {props.count}
        </p>
    )
}, Label, Count)
```
  
Using our component is like any other, here, we design a parent 
component that passes `count` down to `PrintCount`.
```jsx
// Before React spread syntax
const Counter = fn(props => {
    return (
        <div className={props.twColor}>
            {/*
                                Repeating props is fine, 
                                but is unnecessary.
                                |
                                v
            */}
            <PrintCount label={props.label} count={props.count} />
        </div>
    )
}, Label, Count, TwColor)
```
  
We'll focus on this React example to look out for pitfalls, but don't forget, 
outside of React we may have written something like:
```js
// Before JavaScript spread syntax
printCount({ label: props.label, count: props.count })
```
In both cases, we can use JavaScript spread syntax. Spreads exist in 
vanilla JavaScript, TypeScript, or React. It's a great tool for cutting 
down on needless repetition. But, before st, it might be a bit rusty. 
  
Spreads work best when the functions have strong types. 
Because `PrintCount` needs `label`, `count`, but not `twColor` 
we can spread all three into it. PrintCount safely ignores 
twColor since it didn't ask for it in its dependency list.
```jsx
// After
const Counter = fn(props => {
    return (
        <div className={props.twColor}>

            <PrintCount {...props} />

        </div>
    )
}, Label, Count, TwColor)
```
  
What if, we added one more wrapper component? Say, we just graduated 
a React tutorial, off to write some real-world code.
```js
const ToggleCounter = fn(props => {
    return (
        props.isActive
            ? <Counter {...props} />
            : <p>*Counter is not active*</p>
    )
}, IsActive, Label, Count, TwColor)
```
  
Prop drilling! Our list of dependencies grows as we nest components. 
Just in time, comes React Context. Our story's hero? No. Instead, 
st has a built-in feature for this exact problem. It's st's first-ever 
feature, composable types.
  
In the next section we look at combining type requirements into a group. 
An vital feature - not at all limited to React. Yet, unlike React Context, 
st's composable types are statically known. If you don't use a Context's 
Provider, your editor won't warn you. You won't know until the code crashes 
while running. Using type composition alongside spreads is as easy as Context 
but as safe as the types we've used so far.
  
### Prop Shortcuts
Prop drilling, dependency injection, or deeply nested parameters 
are tedious to pass, hard to change later, easy to break. The answer? 
Spreads. Half of the equation is passing props easily through components 
that aren't the direct users. In the previous section, we used JavaScript 
spread syntax for prop passing. Can we have spreads for the prop's types too?
Yes.

All functions you write using `fn()` have a built-in feature, composability. 
So far, we've always passed prop types to our dependency list. We can also 
pass functions we expect to call. Look closely at our dependency list in the 
following before / after:
```jsx
// Before prop shortcuts
const ToggleCounter = fn(props => {

    console.log(props.isActive)

    return <Counter {{/* ... */}} />

    // ⚠️ Long dependency list gets harder to manage
    // |
    // v
}, IsActive, Label, Count, TwColor)
```
```jsx
// After
const ToggleCounter = fn(props => {

    console.log(props.isActive)

    return <Counter {{/* ... */}} />
    
    // Short dependencies using "shortcuts"
    // |
    // v
}, IsActive, Counter)
```
  
Where did our dependencies go? We didn't need to type them individually. 
We only need those props to call the `<Counter />` component. By passing 
Counter as a dependency, we say, "I need all the props that Counter needs." 
  
You can pass one or more functions as dependencies. You can pass functions 
alongside prop types, like above. You aren't required to call the functions 
in your dependency list, it's simply a way to compose prop types. Just as 
spreads can pass props you need but also some you don't, type composition 
requests all its dependencies for you regardless of whether you need them all.
  
There's one specific modifier to help trim type composition. 
Use `MHide()` to opt-out of specific prop types. If your 
function asks for `label`, but you want to pass a specific value 
instead of adding it to your dependencies, use `MHide`.
```js
// Before
const ToggleCounter = fn(props => { 
    let label = "Shoe Sales"
    return /*...*/ 

    //          ⚠️ Requires all <Counter> props 
    //          passed but label shouldn't be! 
    //          |
    //          v
}, IsActive, Counter)

<ToggleCount isActive count={2} twColor="red" /> // 🚩 static error: missing "label"
```
```js
// After
const ToggleCounter = fn(props => { 
    let label = "Shoe Sales"
    return /*...*/ 

    //          Requires most <Counter> props 
    //          except for label.
    //          |
    //          v
}, IsActive, MHide(Counter, Label))

<ToggleCount isActive count={2} twColor="red" /> // no error, good to go
```
  
This is the last section covering declaring functions in st.

  
## Underdocumented
Library exports `TypeDefinition` for authors creating their own version of `declareProps`, `SymbolDefinition` for creating decorators.
  
## Thank you
This library is based on a demo written by Tate on June 12th, 2022. 
Josiah helped feature guide most of this release of st.
  