
# st
What's st? The best way to pass state in your application. 
Front-end? Back-end? Yep, it's better using st. 
## Launchpad 🚀
Five minutes. That's all you need to get started. 
### An early comparison
Below, notice how we duplicate `{ count: number }`. We wanted 
our functions to be strongly typed, but can we spare a few keystrokes?
```ts
const PrintCount = (props: { count: number }) => {
    console.log(props.count);
}
const DoubleCount = (props: { count: number }) => {
    return props.count * 2;
}
```
Using st, we'll define one type. Then, when we create our function, 
we'll pass in the type we defined.
```js
import { defineProp, fn } from "st"

// Count is a type, its a number.
const Count = defineProp(0);


// fn takes two parameters, your function, then its prop types.
const PrintCount = fn(props => {
    console.log(props.count);
}, { Count });

const DoubleCount = fn(props => {
    return props.count * 2;
}, { Count });
```
### Defining your function props
In st, we designed component-first. Let's see what that means by seeing 
how we define parameters.
```js
import { defineProp } from "st"

const Name = defineProp("");
const Age = defineProp(0);
const IsAdult = defineProp(false);
const Car = defineProp({ make: "", model: "" });
```
Once you declare a prop, it'll be the type you specified. 
We always write our types starting in `CapitalCase`. Why? 
Because it easily stands out as a type, since props are `camelCase`.
### Writing your function
Before st, we might define props like: `props: { name: string }`. 
Instead, `props` is defined automatically. How? We pass a second parameter 
to fn. We're passing our Name type in this example.
```js
import { fn } from "st"

const printName = fn(props => {
    console.log(props.name);
}, { Name });
```
That's not a typo. We passed in `Name`, but we're accessing it as `props.name`. 
This small difference keeps you safe, especially when destructuring props. 
There are no rules on how you capitalize your functions, but we're using `camelCase` 
explicitly to show that you're not required to use a framework to use st.
### Calling our function
There's no magic here, just call your function by passing in your props.
```js
printName({ name: "John" });
printName({ name: "Jane" });

const myFriend = { name: "JoAnn" };
printName(myFriend);
```
You'll notice that the props aren't `CapitalCase`. It's exactly 
how you access them in your function. If you use React, your functions 
are fully-fledged components. 
### (Optional) Components
Any function written in st is a valid component. 
```jsx
import { fn } from "st"

const ShowCar = fn(props => {
    return (
        <div>
            <h1>{props.car.make} {props.car.model}</h1>
        </div>
    );
}, { Car });

function App() {
    return (
        <ShowCar car={{ make: "Ford", model: "F150" }} />
    );
}
```