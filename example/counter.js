const CounterComponent = Parvin.createComponent(
    'Counter',
    'div',
    {},
    `<template> 
        <div style="display: flex; gap: 1rem; margin: 1rem">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <p class="card-text">My counter</p>
                    <p> count: $$counter </p>
                    <button type="button" $click="increment" class="btn btn-primary">Increment</button>
                    <button type="button" $click="decrement" class="btn btn-danger" style="margin-left:15px;">Decrement</button>
                </div>
            </div>
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <p class="card-text">Form</p>
                    <p> name: $$form.user.name </p>
                    <p> last name: $$form.user.lastName </p>
                    <p> form: $$form</p>
                    <button type="button" $click="toUpper" class="btn btn-primary">Upper case</button>
                    <button type="button" $click="toLower" class="btn btn-danger" style="margin-left:15px;">Lower case</button>
                </div>
            </div>
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <p class="card-text">Items</p>
                    <p> items: $$items </p>
                    <button type="button" $click="addItem" class="btn btn-primary">Add item</button>
                </div>
            </div>
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <p class="card-text">Boolean thing</p>
                    <p> condition: $$condition </p>
                    <div $if="condition" class="alert alert-warning" role="alert">
                        Condition is true
                    </div>
                    <!--<div $else-if="condition2" class="alert alert-warning" role="alert">
                        To be added soon
                    </div> --->
                    <div $else class="alert alert-info" role="alert">
                        Condition is false
                    </div>
                    <button type="button" $click="toggle" class="btn btn-primary">Toggle</button>
                </div>
            </div>
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <p class="card-text">Input</p>
                    <p> input: $$input </p>
                    <input type="text" $model="input" />
                </div>
            </div>
        </div>
     </template>
     <script>
        {
            state: {
                counter: 1,
                form: {
                    user: {
                        name: "ata",
                        lastName: "parvin ghods"
                    }
                },
                items:[],
                condition: false,
                condition2: false,
                input:""
            },
            methods:{
                increment: function(){
                    this.state.counter++
                },
                decrement: function(){
                    this.state.counter--
                },
                toUpper: function(){
                    this.state.form.user.name = "Ata"
                    this.state.form.user.lastName = "Parvin Ghods"
                },
                toLower: function(){
                    this.state.form.user.name = "ata"
                    this.state.form.user.lastName = "parvin ghods"
                },
                addItem: function(){
                    this.state.items.push("item")
                },
                toggle: function(){
                    this.state.condition = !this.state.condition
                }
            },
            onCreated: function(){
                console.log("component created")
            },
            onDestroyed: function(){
                console.log("component destroyed")
            },
            onUpdated: function(){
                console.log("component updated")
            },
            onMounted: function(){
                console.log("component mounted")
                // setInterval(() => {
                //     this.state.counter++
                // }, 1000)
            },
            watchers:{
                counter(oldValue, newValue, property){
                    console.log(property,"value changed from ", oldValue, " to ", newValue)
                }
            }
        }
     </script>
    `,
)

export default CounterComponent
