<template>
  <div class="body">
    <div class="left">
      <div style="display: flex;" class="subJect" v-for="(subjects, subjectType) in majorlist" :key="subjectType">
        <!-- 显示大类学科 -->
        <span style="color: #333333; font-size: 14px; margin-right: 10px;" @click="golesson(subjectType)">{{ subjectType
        }}</span>
        <!-- 遍历同一大类下的小类学科 -->
        <div>
          <span style="color: #999999; font-size: 12px;" v-for="subject in subjects"
            @click="golesson(subjectType, subject)" :key="subject">{{ subject }} / </span>
        </div>
      </div>
    </div>
    <div class="middle">
      <el-carousel height="380px">
        <el-carousel-item class="lessons" v-on:click.native="goweblesson(item)" v-for="(item, index) in list"
          style="border-radius: 10px;" :key="index">
          <img :src="item.imageUrl" alt="" style="width: 100%;height: 100%;">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="right">
      <div class="login-box">

        <div v-show="online == null">
          <div class="img-box">
            <img src="../../../../public/imgs/tx1.png" alt="">
          </div>

          <div style="height: 80px;width: 250px; position: relative; left: 0; right: 0; margin: 0 auto;">
            <button class="btn-boxs" style="margin-top: 10px; margin-left: 17%;" @click="LClick">登录</button>
            <button class="btn-boxs" style="margin-top: 10px; margin-left: 17%;" @click="RClick">去注册</button>
          </div>
        </div>
        <div style="text-align: center; overflow: hidden;" v-if="online != null">
          <div class="img-box">
            <img :src="user.imageUrl" alt="">
          </div>
          <span style="position: relative;bottom: 35px;">{{ user.username }}</span>

          <div style="height: 58px;">
            <button class="btn-boxs" @click="LessonClick"><span v-show="user.role != 0">我的课程</span> <span v-show="user.role == 0">开始管理</span></button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios'
export default {
  name: 'TopPage',
  data() {
    return {
      list: [],//图片列表
      majorlist: [],//科目列表
      online: localStorage.getItem('isOnline'),
      user: JSON.parse(localStorage.getItem('users'))
    }
  },
  methods: {
    LClick() {
      this.$router.push("/login")
    },
    RClick() {
      this.$router.push("/register")
    },
    golesson(value, subj) {
      localStorage.setItem('marjor', value)
      if (subj == undefined) {
        localStorage.setItem('subject', '全部')
      } else {
        localStorage.setItem('subject', subj)
      }
      this.$router.push('/marjorlesson')
    },
    goweblesson(item) {
      localStorage.setItem('choselesson', JSON.stringify(item))
      this.$router.push('/weblesson')
    },
    LessonClick() {
      if (this.user.role == 1) {
        this.$router.push('/mycount/teacherLesson/success')
      } else if (this.user.role == 2) {
        this.$router.push('/mycount/mylesson')
      } else {
        this.$router.push('/mycount/myinform')
      }
    }
  },
  computed: {
  },
  mounted() {
    axios({/*图片数组*/
      method: 'get',
      url: 'http://localhost:8081/course/queryRandomCourses',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(resp => {
      this.list = resp.data.data
    }).catch(err => {
      console.log('失败：', err)
    })

    if (localStorage.getItem('majorlist') == null) {
      //所有学科的科目
      axios({
        method: 'get',
        url: 'http://localhost:8081/subject/getAll',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(resp => {
        this.majorlist = resp.data.data;
        localStorage.setItem('majorlist', JSON.stringify(resp.data.data))
        this.loading = false
      }).catch(err => {
        this.$notify({
          title: '错误',
          message: ('网络出错了'),
          position: 'bottom-right'
        });
        this.loading = false
        console.log('失败：', err)
      })
    } else {
      this.majorlist = JSON.parse(localStorage.getItem('majorlist'))
    }
  }
}
  //aaa
</script>
<style scoped>
.body {
  margin-left: 50px;
  height: 400px;
}


.btn-boxs {
  position: relative;
  border: none;
  width: 168px;
  height: 32px;
  border-radius: 18px;
  line-height: 32px;
  font-size: 14px;
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: #00CC7E;
  outline: none;
  cursor: pointer;
  -webkit-transition: 0.1s all;
  transition: 0.1s all;
}


/* 按钮 */
.btn-box {
  width: 100px;
  height: 30px;
  margin-bottom: 10px;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  background-color: #c08f8a;
  /* border: 1px solid #e6a49d; */
}

button:hover {
  cursor: pointer;
}

.img-box {
  width: 150px;
  height: 150px;
  margin: 50px auto;

  border-radius: 80%;
  /* 溢出隐藏 */
  overflow: hidden;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, .1);

}

/* 图片 */
.img-box img {
  width: 100%;
  height: 100%;
}

#couter {
  width: 99%;
  height: 631px;
  display: flex;
  margin-top: 30px;
}

#text {
  position: absolute;
  left: 100px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  z-index: 99;
  font-size: 45px;
}

.left {
  width: 17%;
  float: left;
  margin-left: 50px;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  overflow: hidden;
  height: 360px;
  padding: 10px 0;
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
  position: absolute;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  left: 0;
  z-index: 9;
}

.middle {
  width: 55%;
  margin-left: 20%;
  float: left;
}

.right {
  float: left;
  width: 20%;
}

.login-box {
  padding-top: 20px;
  padding-bottom: 31px;
  margin-left: 20px;
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
}

.subJect {
  box-sizing: border-box;
  width: 200px;
  height: 34px;
  padding: 0 12px;
  line-height: 34px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgb(153, 153, 153);
}

.subJect:hover {
  width: auto;
  background: rgba(0, 199, 88, 0.1);
  color: #00CC7E;
}

.subJect span:hover {
  text-decoration: underline;
  cursor: pointer;
  color: #00cc7e;
}

.lessons:hover {
  cursor: pointer;
}
</style>