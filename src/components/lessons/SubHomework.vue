<template>
  <div id="root" v-loading="loading">
    <div id="mycount"><!--这个页面只是拿到课件而已，很简单-->
      <div style="position: relative; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
        添加作业附件：<input type="file" id="lessonfile" @change="handleFileChange">
        <br>
        <div style="margin-left: 22px; margin-top: 20px;"><el-button type="primary" @click="subHomeWork">提交作业</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SubHomework',
  data() {
    return {
      loading: false,
      assignmentUrl: null,
      userId: JSON.parse(localStorage.getItem('users')).id,
      courseId: JSON.parse(localStorage.getItem('choselesson')).courseId
    }
  },
  methods: {
    handleFileChange(event) {//这是上传头像的操作
      const fileInput = event.target;
      const selectedFile = fileInput.files[0];
      this.loading = true

      // 检查文件大小是否符合限制（以字节为单位）
      const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
      //检查是否选择文件  
      if (selectedFile) {
        if (selectedFile.size > maxSizeBytes) {
          alert("上传的文件大小超过限制，请选择小于5MB的文件。");
          fileInput.value = ""; // 清空文件输入框，阻止上传
          this.loading = false
          return;
        } else {
          this.loading = false
          let fileInput = document.getElementById('lessonfile');
          let file2 = fileInput.files[0]
          const formData2 = new FormData();
          formData2.append("avatar", file2);
          this.$store.dispatch("uploadFile", formData2);
          this.loading = true;
          setTimeout(() => {
            this.assignmentUrl = this.$store.state.FILEURL;
            if (this.assignmentUrl != null) {
              this.$notify({
                title: '消息',
                message: ("作业上传成功"),
                position: 'bottom-right'
              });
            } else {
              this.$notify({
                title: '消息',
                message: ("作业上传失败，请重试"),
                position: 'bottom-right'
              });
            }
            this.loading = false
          }, 500);
        }
      }
    },
    subHomeWork() {
      this.loading = true
      if (this.assignmentUrl == null) {
        this.$notify({
          title: '消息',
          message: ("缺少对应信息，请填写完整"),
          position: 'bottom-right'
        });
        this.loading = false
        return;
      } else {
        axios({
          method: 'post',
          url: 'http://localhost:8081/assignment/submit',
          data: JSON.stringify({ assignmentUrl: this.assignmentUrl, courseId: this.courseId, userId: this.userId }),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(resp => {
          this.$notify({
            title: '消息',
            message: (resp.data.msg),
            position: 'bottom-right'
          });
          this.loading = false
        }).catch(err => {
          this.$notify({
            title: '错误',
            message: ('连接失败'),
            position: 'bottom-right'
          });
          this.loading = false
          console.log('失败：', err)
        })
      }
    }
  }
}
</script>

<style scoped>
#mycount {
  width: 1133px;
  height: 300px;
  padding: 10px 10px;
  background-color: rgb(255, 255, 255);
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
}
</style>