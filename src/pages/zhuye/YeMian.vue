<template>
  <div id="root">
    <div id="conter">
      <TopPage />
      <HotLesson />
    </div>
  </div>
</template>
  
<script>
import TopPage from '../../components/zhuye/YeMian/TopPage.vue'
import HotLesson from '../../components/zhuye/lesson/HotLesson.vue'
export default {
  name: 'YeMian',
  data() {
    return {
      majorlist: [],//学科所有科目
    }
  },
  methods: {
    
  },
  components: {
    TopPage,HotLesson
  },
  mounted() {
    this.majorlist = this.$store.state.lessonCatgory
  }
}
</script>
  
<style scoped>
#conter {
  width: 1400px;
  padding-top: 40px;
  top: 20px;
  margin-top: 100px;
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>