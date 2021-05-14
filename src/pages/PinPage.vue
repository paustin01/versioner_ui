
<script>
import auth from '../utils/auth.js';
export default {
    name:'PinPage',
    data(){
        return {
            pin:0,
            msg: 'Please Enter Your Pin:',
        }
    },

    methods:{

        enterPin(evt){
            let pin = evt.target.pin.value.trim();
            let valid_pin = auth.valid(parseInt(pin) );
            if (valid_pin){
                auth.save(pin);
                window.location = "";
            }else{
                this.msg = 'Incorrect Pin Please Try Again.'
            }
        }
    }

}
</script>

<style scoped>
.pin-push{
    margin: 60px;
}

.pin-wrap{
    position: relative;
    width:200px;
}

.pin-btn{
   position: absolute; 
   right: 0px;
   top: 0px;
   height:40px;
   padding:7px;
   border-radius: 0px 0px 3px -3px;
   background:#00446A;
   color: #f6f6f6;
   cursor: pointer;
   box-shadow: -4px 0 3px -2px rgba(0,0,0,0.2);
}

.pin-btn:hover{
    color:#fff;
}

.pin-input{
    height: 40px;
    padding: 7px;
    border: none;
    border-radius: 3px;
    background: #f6f6f6;
}
</style>

<template>
<div class="pin-push">
	<form id="pin-form" v-on:submit.prevent="enterPin" method="post">
        <p><label for="pin">{{msg}}</label><p>
        <div class="pin-wrap">
        <input type="text" class="pin-input" name="pin" id="pin" placeholder="Pin" value="" />
        <input type="submit" value="enter" class="pin-btn">
        </div>
	</form>
</div>
</template>


