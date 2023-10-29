<template> 
    <span class="sname">Ім'я: {{ student.name }}</span><br>
    <span class="sname">Кількість студентів: {{studentsCount}}</span>
    <img class="sphoto" v-bind:src="student.photo" >
</template> 
 
<script> 
import axios from "axios"; 
 
export default { 
    props: { 
        id: '', 
    }, 
    data() { 
        return { 
            student: {}, 
        }; 
    }, 
    mounted: function () { 
        axios.get("http://34.82.81.113:3000/students/" + this.id).then((response) => { 
            this.student = response.data; 
        }) 
    },
     computed: {
    studentsCount () {
      return this.$store.getters.getCount;
    }
  },
} 
</script> 
 
<style scoped>
    .sname{
        color: white;
    }
    .sphoto{
        margin-left: 20%;
    }
</style>