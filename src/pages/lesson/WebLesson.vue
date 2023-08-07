<template>
  <div id="root">
    <div id="conter" v-loading="loading"><!--存放课程的网页-->
      <div id="mycount">
        <div id="topbox"><!--顶端课程信息-->
          <div id="imgconter">
            <img class="img" id="" :src="lesson.imageUrl" width="400" height="300" alt="图片">
          </div>
          <div id="lessoninform">
            <div style="font-size: 25px;
                            color: #333333;
                            margin-right: 6px;
                            font-weight: 600;">{{ lesson.name }}</div>
            <div class="midbox">
              <p><i class="el-icon-user lessonIcon"></i>任课教师:<span class="lessonclick" @click="goteacher">{{ lesson.author }}</span></p>
              <p><i class="el-icon-edit lessonIcon"></i>课程类别:<span class="lessonclick" @click="gosubject">{{ lesson.subName }}</span></p>
              <p><i class="el-icon-alarm-clock lessonIcon"></i>更新时间:<span>{{ formatDate(lesson.updateTime) }}</span></p>
              <p><i class="el-icon-s-finance lessonIcon"></i>所需坤分:<span>{{ lesson.price }}</span></p>
              <div class="description-conter"><!--存放描述的盒子-->
                <p class="description">
                  <i class="el-icon-s-finance lessonIcon"></i>课程描述:<span>{{ getDescriptionDisplay }}</span>
                </p>
                <el-link class="description-detail" v-if="this.lesson.description.length > 20 && !show"
                  @click="showDetail" type="info">详情</el-link>
              </div>
            </div>
            <el-button v-show="isMyLesson != 0" type="success" @click="role_dif_func" class="lessonbtn" round><span
                v-show="isMyLesson == 1 ">购买课程</span><span
                v-show="isMyLesson == 2 || isMyLesson == 3">进入课程</span></el-button>
            <el-button v-show="isMyLesson != 0 && isMyLesson == 3" type="danger" class="lessonbtn"
              @click="deleteLesson">下架课程</el-button>
            <el-button type="info" class="lessonbtn fail" v-show="isMyLesson == 0" disabled round>已下架</el-button>
          </div>
        </div>
      </div>
      <el-dialog title="验证账号信息" :visible.sync="dialogFormVisible">
        系统监测你正在进行敏感操作，需要验证信息
        <el-input style="margin-top: 20px;" v-model="username" placeholder="请输入账号的用户名"></el-input>
        <el-input style="margin-top: 10px;" v-model="password" placeholder="请输入账号的密码"></el-input>
        <el-button style="margin-top: 20px;" @click="Dzhen" type="primary">验证</el-button>
      </el-dialog>
      <WebLessonBottom></WebLessonBottom>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WebLessonBottom from '@/components/zhuye/lesson/WebLessonBottom.vue';
export default {
  name: 'WebLesson',
  data() {
    return {
      lesson: JSON.parse(localStorage.getItem('choselesson')),
      user: JSON.parse(localStorage.getItem("users")),//获取个人id，如果是自己的课那么就可以进行其他操作
      show: false,
      buyLesson: [],//查看用户购买的课程
      loading: false,
      dialogFormVisible: false,//进行验证信息
      username: null,//验证的账号信息
      password: null,//验证的密码信息
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    formatDate(row) {
      const dateStr = row; // 获取日期字符串，例如 "2023-07-28T08:39:21.000+00:00"
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    updateUser() {//更新用户数据
      axios({
        method: 'post',
        url: 'http://localhost:8081/user/getUser?userId=' + this.user.id,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(resp => {
        if (resp.data.code == 2004) {
          let obj = JSON.parse(localStorage.getItem('users'));
          obj.credit = resp.data.data.credit;
          localStorage.setItem('users', JSON.stringify(obj));
        } else {
          this.$message(resp.data.msg)
        }
        this.loading = false;
        setTimeout(() => {
          this.$router.go(0)
        }, 1000);
      }).catch(err => {
        this.loading = false
        this.$notify({
          title: '错误',
          message: ('网络出错了'),
          position: 'bottom-right'
        });
        console.log('失败：', err)
      })
    },
    role_dif_func() {/**根据是否是个人课程不同而产生不同的结果 */
      if(this.user == null){//游客问题
        this.$confirm('该功能需要登录，前往登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {
          this.$notify({
            title: '消息',
            message: ("已取消操作"),
            position: 'bottom-right'
          });
        });
      }else if (this.isMyLesson == 2 || this.isMyLesson == 3) {//自己课或者已经买了
        this.$router.push('/lessondetail/detailinform')
      } else if (this.isMyLesson == 1) {//不是自己课并且没买
        this.$confirm('确认购买该课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          if (!this.$store.state.yanzheng) {
            this.loading = false
            this.dialogFormVisible = true
          }
          else {
            axios({
              method: 'post',
              url: 'http://localhost:8081/stuCourses/buyCourse',
              data: JSON.stringify({ userId: this.user.id, courseId: this.lesson.courseId }),
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
            }).then(resp => {
              if (resp.data.code == 2003) {
                this.$notify({
                  title: '消息',
                  message: ("购买成功"),
                  position: 'bottom-right'
                });
                this.updateUser();
              } else {
                this.$notify({
                  title: '消息',
                  message: (resp.data.msg),
                  position: 'bottom-right'
                });
                this.loading = false
              }
            }).catch(err => {
              this.$notify({
                title: '错误',
                message: ("网络故障"),
                position: 'bottom-right'
              });
              console.log('失败：', err)
              this.loading = false
            })
          }
        }).catch(() => {
          this.$notify({
            title: '消息',
            message: ("已取消操作"),
            position: 'bottom-right'
          });
        });
      }
    },
    Dzhen() {//验证信息
      this.loading = true;
      axios({
        method: 'post',
        url: 'http://localhost:8081/stuCourses/checkPwd',
        data: JSON.stringify({ password: this.password, username: this.username }),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
      }).then(resp => {
        if (resp.data.code == 2004) {
          this.dialogFormVisible = false;
          this.$store.state.yanzheng = true;
          this.$notify({
            title: '消息',
            message: ("验证成功"),
            position: 'bottom-right'
          });
        } else {
          this.$notify({
            title: '消息',
            message: (resp.data.msg),
            position: 'bottom-right'
          });
        }
        this.loading = false
      }).catch(err => {
        this.$notify({
          title: '消息',
          message: ("连接失败"),
          position: 'bottom-right'
        });
        console.log('失败：', err)
        this.loading = false
      })
    },
    showDetail() {//让省略的信息展开
      this.show = !this.show
    },
    goteacher(){//去看老师界面
      this.$router.push('/teacherslesson')
    },
    gosubject(){//去看科目界面
      localStorage.setItem('marjor',this.lesson.subCategory)
      localStorage.setItem('subject',this.lesson.subName)
      this.$router.push('/marjorlesson')
    },
    deleteLesson() {
      this.$confirm('这将下架您的课程，是否继续(此操作不可逆)?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        if (!this.$store.state.yanzheng) {
          this.loading = false
          this.dialogFormVisible = true
        }
        else {
          axios({
            method: 'post',
            url: 'http://localhost:8081/course/updateStatu?courseId=' + this.lesson.courseId,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
          }).then(resp => {
            if (resp.data.code == 2003) {
              this.lesson.statu = 0;
              localStorage.setItem('choselesson', JSON.stringify(this.lesson))
              this.$router.go(0)
            } else {
              this.$notify({
                title: '消息',
                message: (resp.data.msg),
                position: 'bottom-right'
              });
            }
            this.loading = false
          }).catch(err => {
            console.log('失败：', err)
            this.loading = false
          })
        }
      }).catch(() => {
        this.$notify({
          title: '消息',
          message: ("已取消操作"),
          position: 'bottom-right'
        });
      });
      console.log(this.lesson.courseId)
    },
  },
  watch: {
    dialogFormVisible(newvalue) {
      if (newvalue == false) {
        this.username = null;
        this.password = null;
      }
    }
  },
  computed: {
    isMyLesson() {
      if (this.lesson.statu == 0) return 0;//如果课程下架了
      else if(this.user == null) return 1;
      else if (!this.buyLesson.includes(this.lesson.courseId) && this.lesson.userId != this.user.id) return 1;//没买并且不是自己的
      else if (this.lesson.userId == this.user.id) return 3;//自己的课
      return 2;//课程通道打开
    },
    getDescriptionDisplay() {
      if (this.lesson.description.length < 20 || this.show) return this.lesson.description
      return this.lesson.description.slice(0, 20) + "...";
    },
  },
  components: {
    WebLessonBottom
  },
  mounted() {
    this.lesson = JSON.parse(localStorage.getItem('choselesson'))
    this.user = JSON.parse(localStorage.getItem("users"))//获取个人id，如果是自己的课那么就可以进行其他操作
    this.loading = true;
    axios({
      method: 'post',
      url: 'http://localhost:8081/course/addSearchFrequency?courseId=' + this.lesson.courseId,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
    if (this.user != null) {//游客问题
      //查看是否买了课
      axios({
        method: 'get',
        url: 'http://localhost:8081/stuCourses/getOwnCourse?userId=' + this.user.id,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(resp => {
        if (resp.data.code == 2004) {
          this.buyLesson = resp.data.data.map(item => item.courseId);
        } else {
          this.$message(resp.data.msg)
        }
        this.loading = false;
        console.log(this.buyLesson)
      }).catch(err => {
        this.loading = false
        this.$notify({
          title: '错误',
          message: ('网络出错了'),
          position: 'bottom-right'
        });
        console.log('失败：', err)
      })
    }else{
      this.loading = false
    }
  }
}
</script>

<style scoped>
#mycount {
  /*大容器*/
  width: 1300px;
  padding-top: 40px;
  top: 20px;
  margin-top: 20px;
  background-color: rgb(255, 255, 255);
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
}

#topbox {
  /* 顶端容器*/
  width: 100%;
  min-height: 288px;
  padding: 0px 0 70px;
  display: flex;
  justify-content: space-around;
}

#imgconter {
  /**图片容器 */
  width: 375px;
  height: 295px;
}

#lessoninform {
  /**课程信息 */
  width: 660px;
}

.midbox {
  /**课程信息中部容器 */
  padding: 4px 19px 16px 16px;
  margin-bottom: 24px;
  background-color: #f8f9fb;
  border-radius: 8px;
  margin-top: 20px;
  z-index: 999;
}

.midbox p {
  /**中部信息段落 */
  color: #666666;
  font-size: 12px;
  padding: 5px 0;
}

.midbox span {
  /**同上 */
  padding-left: 10px;
}

.lessonIcon {
  /**中部信息图标 */
  padding: 0 3px;
}

.lessonbtn {
  /**课程按钮 */
  height: 48px;
  line-height: 15px;
  font-size: 16px;
  margin-top: 28px;
  min-width: 192px;
  font-weight: 600;
  border-radius: 24px;
}

.fail {
  background-color: #666666;
  border: 1px solid #DCDFE6;
}

.description-conter {
  /**存放描述的盒子 */
  display: flex;
  align-items: center;
  font-size: 12px;
}

.description-detail {
  /**详情 */
  text-decoration: none;
}

.lessonclick:hover{
  cursor: pointer;
  color: #00cc7e;
}
</style>