const CounterComponent = Parvin.createComponent(
    'Counter',
    'div',
    {},
    `<template>
        <div class="card" style="width: 18rem; margin: 5rem auto;">
            <div class="card-body">
                <p class="card-text">My counter</p>
                <p> count: $$counter </p>
                <button type="button" $click="increment" class="btn btn-primary">Increment</button>
                <button type="button" $click="decrement" class="btn btn-danger" style="margin-left:15px;">Decrement</button>
            </div>
        </div>
     </template>
     <script>
        {
            state: {
                counter: 1
            },
            methods:{
                increment: function(){
                    this.state.counter++
                },
                decrement: function(){
                    this.state.counter--
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
                    console.log(this)
                }
            }
        }
     </script>
    `,
)

export default CounterComponent
