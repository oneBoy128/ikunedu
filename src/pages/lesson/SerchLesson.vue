<template>
  <div id="root">
    <div id="mycount" v-loading = "loading">
      <div id="topcount">
        <el-link class="pai" @click="pai(0)">升序</el-link>
        <el-link class="pai" @click="pai(1)">降序</el-link>
      </div>
      <div class="serchItem" v-for="sub in datas" :key="sub.courseId"><!--找到的课程大盒子-->
        <div class="u-img"><!--这里存放课程图片-->
          <el-image @click="golesson(sub)" :src="sub.imageUrl" style="width: 100%;height: 100%;" lazy></el-image>
        </div>
        <div style="padding-left: 20px;">
          <div class="g-mn1">
            <el-link :underline='false' class="g-mn1-a" href="">课程名: {{ sub.name }}</el-link>
          </div>
          <div class="author"> <a class="au-fc9" href="/u/ykt1493110492948" target="_blank">授课老师: {{ sub.author }} </a>
          </div>
          <div class="money">所需坤分: {{ sub.price }}</div>
          <div class="description">
            <span @click="golesson(sub)">描述: {{ sub.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SerchLesson',
  data() {
    return {
      datas: [],
      loading:false,
    }
  },
  methods: {
    golesson(sub) {
      localStorage.setItem('choselesson', JSON.stringify(sub))
      this.$router.push('/weblesson')
    },
    pai(value) {
      this.loading = true
      axios({
        method: 'get',
        url: 'http://localhost:8081/course/queryFuzzyOrderByPrice?name=' + localStorage.getItem('serchInform') +'&sort='+value,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(resp => {
        this.datas = resp.data.data
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
  },
  mounted() {
    this.loading = true;
    axios({
      method: 'get',
      url: 'http://localhost:8081/course/queryFuzzy?name=' + localStorage.getItem('serchInform'),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(resp => {
      this.datas = resp.data.data
      this.loading = false
    }).catch(err => {
      this.loading = false
      this.$notify({
        title: '错误',
        message: ('连接失败'),
        position: 'bottom-right'
      });
      console.log('失败：', err)
    })
  }
}
</script>

<style scoped>
#mycount {
  width: 1300px;
  top: 20px;
  background-color: rgb(255, 255, 255);
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: 40px;
}

#topcount {
  width: 100%;
  height: 40px;
  background: rgb(242, 242, 242);
  ;
}

.description {
  position: relative;
  margin: 15px 10px 20px 0;
  font-size: 13px;
  text-align: left;
  color: #999;
  line-height: 22px;
  height: 87px;
  overflow: hidden;
}

.pai {
  font-size: 12px;
  margin-right: 20px;
}

.description span:hover {
  cursor: pointer;
  color: #00cc7e;
}

.serchItem {
  display: flex;
  width: 100%;
  height: 150px;
  padding: 20px 0px 20px 0px;
  border-bottom: 1px solid #e6e6e6;
  -webkit-box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
}

.u-img {
  overflow: hidden;
  width: 265px;
  height: 150px;
}

.u-img:hover {
  cursor: pointer;
}

.author {
  margin-top: 10px;
  font-size: 12px;
  line-height: 15px;
}

.money {
  margin-top: 10px;
  font-size: 12px;
  line-height: 15px;
}

.au-fc9 {
  color: #999;
}

.au-fc9:hover {
  color: #00cc7e;
}

.g-mn1-a {
  color: #333333;
}

.g-mn1-a:hover {
  color: #00cc7e;
}
</style>