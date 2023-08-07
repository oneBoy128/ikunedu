<template>
  <div id="root">
    <div id="conter"><!--存放课程的网页-->
      <div id="mycount">
        <el-steps :active="active" finish-status="success">
          <el-step title="验证身份"></el-step>
          <el-step title="设置密码"></el-step>
          <el-step title="改密成功"></el-step>
        </el-steps>
        <div id="view">
          <div v-show="active == 0">
            <el-form :model="safeAcount" ref="form" label-width="80px" label-position="left">
              <el-form-item prop="email">
                <el-input v-model="safeAcount.email" disabled>
                  <template slot="prepend"><i class="el-icon-edit"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="codes">
                <div class="input-container">
                  <el-input placeholder="输入验证码" v-model.number="safeAcount.codes"></el-input>
                  <el-button style="width: 150px; margin-left: 20px;" @click="getcodings">{{ isButtonDisabled ? `倒计时
                    ${countdownSeconds} 秒` : '发送验证码' }}</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="active == 1">
            <el-form :model="safeAcount" ref="form" label-width="80px" label-position="left">
              <el-form-item label="新密码" prop="password">
                <el-input autocomplete="off" prefix-icon="el-icon-lock" placeholder="至少6位字母和数字" show-password
                  v-model.number="safeAcount.password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="passwords">
                <el-input autocomplete="off" prefix-icon="el-icon-lock" placeholder="至少6位字母和数字" show-password
                  v-model.number="safeAcount.passwords"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="active == 3">
            <el-result icon="success" title="成功提示" subTitle="请根据提示进行操作">
              <template slot="extra">
                <el-button type="primary" @click="reload" size="medium">重新登录</el-button>
              </template>
            </el-result>
          </div>
        </div>
        <el-button v-show="active != 3" class="nextbtn" @click="next">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SafeHelper',
  data() {
    return {
      active: 0,
      safeAcount: {
        email: JSON.parse(localStorage.getItem('users')).email,
        password: null,
        passwords: null,
        codes: null,//邮箱验证码
      },
      isButtonDisabled: false, // 初始状态下按钮可点击
      countdownSeconds: 60 //倒计时的秒数
    };
  },

  methods: {
    next() {
      if (this.active == 0) {
        if (this.safeAcount.codes == null) {
          this.$notify({
            title: '错误',
            message: ('验证码不能为空'),
            position: 'bottom-right'
          });
          return;
        }
        axios({
          method: 'get',
          url: 'http://localhost:8081/user/checkCaptcha?captcha=' + this.safeAcount.codes + '&email=' + this.safeAcount.email,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(resp => {
          if (resp.data.code == 2007) {
            this.active++;
          } else {
            this.$notify({
              title: '消息',
              message: (resp.data.msg),
              position: 'bottom-right'
            });
          }
        }).catch(err => {
          this.$notify({
            title: '错误',
            message: ('网络出错了'),
            position: 'bottom-right'
          });
          console.log('失败', err)
        })
      } else {
        if (this.safeAcount.password != this.safeAcount.passwords) {
          this.$notify({
            title: '消息',
            message: ('两次密码要一致'),
            position: 'bottom-right'
          });
          return;
        }
        if (this.safeAcount.password == null || this.safeAcount.passwords == null) {
          this.$notify({
            title: '消息',
            message: ('新密码不能为空'),
            position: 'bottom-right'
          });
          return;
        }
        axios({
          method: 'POST',
          url: 'http://localhost:8081/user/updatePwd',
          data: JSON.stringify({ email: this.safeAcount.email, newPwd: this.safeAcount.password }),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(resp => {
          if (resp.data.code == 2003) {
            this.active += 2
          } else if (resp.data.code == 4003) {
            this.$notify({
              title: '消息',
              message: (resp.data.msg),
              position: 'bottom-right'
            });
          }
        }).catch(err => {
          this.$notify({
            title: '消息',
            message: ('连接出错'),
            position: 'bottom-right'
          });
          console.log('失败', err)
        })
      }
    },
    getcodings() {//发送验证码按钮
      if (!this.isButtonDisabled) {
        // 处理按钮点击事件
        axios({
          method: 'get',
          url: 'http://localhost:8081/user/getCaptcha?email=' + this.safeAcount.email,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then().catch(err => {
          this.$message('失败了，网络出问题了');
          console.log('失败', err)
        })

        // 禁用按钮
        this.isButtonDisabled = true;
        // 60秒后恢复按钮可点击
        setTimeout(() => {
          this.isButtonDisabled = false;
        }, 60000);

      }
    },
    startCountdown() {
      // 使用 setInterval 实现倒计时
      const interval = setInterval(() => {
        this.countdownSeconds -= 1;

        // 倒计时结束时恢复按钮可点击状态
        if (this.countdownSeconds === 0) {
          clearInterval(interval);
          this.isButtonDisabled = false;
          this.countdownSeconds = 60; // 重置倒计时秒数
        }
      }, 1000);
    },
    reload() {//修改成功了，现在要重新登录
      this.$store.commit('letReload');
      this.$router.push({ path: '/' })
    }
  },

  watch: {
    isButtonDisabled(newValue) {
      if (newValue) {
        this.startCountdown();
      }
    }
  }
}
</script>

<style scoped>
#mycount {
  display: block;
  width: 800px;
  padding: 20px 80px;
  height: 450px;
  background-color: rgb(255, 255, 255);
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 80px;
}

#view {
  width: 631px;
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 66px;
}

.input-container {
  display: flex;
  /* 使用 Flexbox 布局，可以将子元素水平排列 */
  align-items: center;
  /* 垂直居中对齐 */
}

.nextbtn {
  /*下一步按钮*/
  display: block;
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 66px;
}</style>