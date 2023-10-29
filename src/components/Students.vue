<template>
  <div :class="themeClass" class="divcont">
    <label for="themeCheckbox">Змінити тему (світла/темна)</label>
    <input  type="checkbox" v-model="darkModeEnabled" @change="toggleTheme">
    <label >Кількість студентів: {{studentsCount}}</label>
    <label for="search" class="search">Пошук:</label>
    <input type="text" v-model="search" placeholder="Пошук за прізвищем">
    <h2 class="add">Додати нового студента</h2>
    <form @submit.prevent="addStudent">
      <input type="text" v-model="newStudent.name" placeholder="ПІБ" required>
      <select v-model="newStudent.group">
        <option value="RPZ 20 1/9">RPZ 20 1/9</option>
        <option value="RPZ 20 2/9">RPZ 20 2/9</option>
      </select>
      <input type="number" v-model="newStudent.mark" placeholder="Оцінка" required>
      <label class="pract">Практика:
        <input type="checkbox" v-model="newStudent.isDonePr">
      </label>
      <label class="pract">Фото:
        <input type="url" v-model="newStudent.photo" placeholder="Фото URL">
      </label>
      <button type="submit" class="btn">Додати</button>
    </form>

<!-- Форма редагування -->
    <div v-if="editingStudent !== null">
      <h2 class="update">Редагування студента</h2>
      <form @submit.prevent="updateStudent">
        <input class="inputupdate" type="text" v-model="editingStudent.name" placeholder="ПІБ" required>
        <select v-model="editingStudent.group">
          <option value="RPZ 20 1/9">RPZ 20 1/9</option>
          <option value="RPZ 20 2/9">RPZ 20 2/9</option>
        </select>
        <input type="number" v-model="editingStudent.mark" placeholder="Оцінка" required>
        <label class="pract">Практика:
          <input type="checkbox" v-model="editingStudent.isDonePr">
        </label>
        <label class="pract">Фото:
          <input type="url" v-model="editingStudent.photo" placeholder="Фото URL">
        </label>
        <button type="submit" class="btn btnupd">Зберегти</button>
        <button @click="cancelEdit" class="btn">Скасувати</button>
      </form>
    </div>

    <table>
      <thead>
        <tr>
          <th>Фото</th>
          <th>ПІБ</th>
          <th>Група</th>
          <th>Оцінка</th>
          <th>Практика</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in filteredStudents" :key="student._id">
          <td>
            <img v-if="student.photo" :src="student.photo" alt="Фото студента" width="50">
            <img v-else src="default_photo_url" alt="Фото відсутнє" width="50">
          </td>
          <td>
            <!-- <span :class="{ 'highlighted-text': student.highlighted }">{{ student.name }}</span> -->
            <span :class="{ 'highlighted-text': student.highlighted }"><router-link v-bind:to='"/student-info/"+student._id'>{{ student.name }}</router-link></span>
          </td>
          <td><span :class="{ 'highlighted-text': student.highlighted }">{{ student.group }}</span></td>
          <td>{{ student.mark }}</td>
          <td>
            <input type="checkbox" v-model="student.isDonePr">
          </td>
          <td>
            <a @click="removeStudent(student._id)" href="#">Видалити</a>
          </td>
          <td>
            <button @click="editStudent(index)"><i class="fa-solid fa-pencil"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    
  </div>
</template>


<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      darkModeEnabled: true,
      search: '',
      newStudent: {
        name: '',
        group: '',
        mark: null,
        isDonePr: false,
        photo: '',
      },
      students: [],
      editingStudent: null, 
      default_photo_url: 'default_photo.jpg',
    };
  },
  mounted(){
    axios.get("http://34.82.81.113:3000/students").then((res)=>{
      this.students = res.data;
      console.log(this.students.length);
      this.$store.commit('setCount', this.students.length); 
    })
  },
  created() {
    this.fetchStudents();
  },
   computed: {
     ...mapGetters(['getSelectedTheme']),
    themeClass() {
      return this.getSelectedTheme;
    },
     filteredStudents() {
      const searchTerm = this.search.toLowerCase();
      return this.students.map((student) => {
        const highlighted = searchTerm && student.name.toLowerCase().includes(searchTerm);
        return { ...student, highlighted };
      });
    },
    studentsCount () {
      return this.$store.getters.getCount;
    }
  },
  methods: {
    toggleTheme() {
    if (this.darkModeEnabled) {
      this.$store.commit('setTheme', 'dark-theme');
    } else {
      this.$store.commit('setTheme', 'light-theme');
    }
    },
    fetchStudents() {
      axios
        .get('http://34.82.81.113:3000/students')
        .then((response) => {
          this.students = response.data;
        })
        .catch((error) => {
          console.error('Помилка при завантаженні студентів:', error);
        });
    },
    removeStudent(id) {
      axios
        .delete(`http://34.82.81.113:3000/students/${id}`)
        .then(() => {
          this.fetchStudents();
        })
        .catch((error) => {
          console.error('Помилка при видаленні студента:', error);
        });
    },
    addStudent() {
      axios
        .post('http://34.82.81.113:3000/students', this.newStudent)
        .then(() => {
          this.fetchStudents();
          this.newStudent = {
            name: '',
            group: '',
            mark: null,
            isDonePr: false,
            photo: '',
          };
        })
        .catch((error) => {
          console.error('Помилка при додаванні студента:', error);
        });
    },
    editStudent(index) {
      // Відкрити форму редагування і встановити дані для редагування
      this.editingStudent = {...this.filteredStudents[index], index};
      // console.log();
    },
    updateStudent() {
      axios
        .put(`http://34.82.81.113:3000/students/${this.editingStudent._id}`, this.editingStudent)
        .then((response) => {
          // this.fetchStudents();
          this.filteredStudents[this.editingStudent.index] = response.data;
          // console.log(response.data);
          this.cancelEdit();
        })
        .catch((error) => {
          console.error('Помилка при оновленні студента:', error);
        });
    },
    cancelEdit() {
      this.editingStudent = null;
    },
  },
};
</script>