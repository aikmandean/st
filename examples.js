// #region Example 1 "Primitive Types"
{
    const Name = defineProp("")

    const printName = fn(props => {
        props.name.length
    }, { Name })

    printName({ name: "Example Name" })
}
// #endregion

// #region Example 2 "Object Types"
{
    const Person = defineProp({ name: "", age: 0 })

    const printPerson = fn(props => {
        props.person.name.length
    }, { Person })

    printPerson({ person: { name: "Example Name", age: 0 } })
}
// #endregion

// #region Example 3 "Composable Functions"
{
    const Name = defineProp("")

    const printName = fn(props => {
    }, { Name })

    const printInfo = fn(props => {
        props.name.length
    }, { printName })

    printInfo({ name: "Example Name" })
}
// #endregion

// #region Example 4 "Non-Composable Callbacks"
{
    const Name = defineProp("")
    const UseName = defineProp(fn(props => {}, { Name }))

    const printName = fn(props => {
        props.useName.length
    }, { UseName })

    printName({ useName: props => props.name.length })
}
// #endregion

// #region Example 5 "Optional Props"
{
    const Name = defineProp("", { default: true })

    const printName = fn(props => {
        props.name.length
    }, { Name })

    printName({})
}
// #endregion

// #region Example 6 "Exclude Props"
{
    const Name = defineProp("")

    const printName = fn(props => {
    }, { Name })

    const printInfo = fn(props => {
        props.name?.length // <- should NOT detect length as readonly
    }, { printName }, { Name })
}
// #endregion