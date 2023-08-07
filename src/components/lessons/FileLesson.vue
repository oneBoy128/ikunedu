<template>
  <div id="root">
    <div id="mycount"><!--这个页面只是拿到课件而已，很简单-->
        <div style="position: relative; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
            <el-link style="font-size: 20px; color: #0396f8;" :href="conterUrl">点击获取文件</el-link>
            <br>
            <span style="position: relative;top: 20px;">注：课件中包括该课程的资料以及作业要求，请务必下载进行学习</span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'FileLesson',
    data(){
        return{
            conterUrl: JSON.parse(localStorage.getItem('choselesson')).contentUrl
        }
    }
}
</script>

<style scoped>
#mycount {
    /*大容器*/
    width: 982px;
    padding: 10px 10px;
    height: 300px;
    background-color: rgb(255, 255, 255);
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
}
</style>