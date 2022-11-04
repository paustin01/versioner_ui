

<script>
export default {
  name:'modal',
}
</script>

<style scoped="scoped">

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #8e8e8e;
  opacity: 0.5;
  z-index: 10;
}

.modal {
  padding: 1rem;
  position: fixed;
  top: 10vh;
  left: 15%;
  width: 80%;
  max-height: 80vh;
  background: #121212;
  border-radius: 5px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  overflow-y: scroll;
  transition: all .3s ease;
}

.modal-header h3 {
  margin-top: 0;
  border-bottom: 1px solid #121212;
}

.modal-body {
  margin: 10px 0;
}

.modal-button {
  float: right;
  background-color: "#1e1e1e1";
  padding:5px;
  border-radius: 5px;
  color:"#ffffff";

}

.modal-button:hover{
  color:#EF7724;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.33);
}

</style>

<template>
<div>

  <div class="backdrop" v-on:click="$emit('closemodal')"> </div>

  <div class="modal">

    <div class="modal-header">
    <slot name="header">
    </slot>
    </div>

    <div class="modal-body">
    <slot></slot>
    </div>

    <div class="modal-footer">
    <slot name="footer">
      <button class="modal-button" v-on:click="$emit('closemodal')">X</button>
      <br />
    </slot>
    </div>

  </div>

</div>
</template>
