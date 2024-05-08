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
            }
        }
     </script>
    `,
)

export default CounterComponent
