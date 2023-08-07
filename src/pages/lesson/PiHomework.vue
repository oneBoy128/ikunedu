<template>
  <div id="conter">
    <div id="view" v-loading="loading">
      <el-empty v-show="isEmpty" description="没有对应的作业信息"></el-empty>
      <el-table height="500" :default-sort="{ prop: 'updateTime' }" v-show="!isEmpty" :data="suclesson" stripe
        style="width: 100%">
        <el-table-column prop="username" label="学生" width="200">
        </el-table-column>
        <el-table-column label="提交时间" width="200">
          <template slot-scope="scope">
            {{ formatDate(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column prop="assignmentUrl" label="作业文件" width="250">
          <template slot-scope="scope">
            <el-link type="primary" :href="scope.row.assignmentUrl">作业文件</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit(scope)">批改作业</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="500px" title="课程信息" :visible.sync="dialogFormVisible">
      <el-input type="number" v-model="score" placeholder="请输入内容"></el-input>
      <div class="subBtn"><el-button @click="PiHomeworks" type="primary" round>批改作业</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
function deepCopy(obj, visited = new WeakMap()) {
  // 如果是基本数据类型或null，则直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  // 检查是否已经访问过该对象，避免循环引用导致的无限递归
  if (visited.has(obj)) {
    return visited.get(obj);
  }
  let copiedObj = Array.isArray(obj) ? [] : {};
  visited.set(obj, copiedObj); // 记录访问过的对象
  // 使用递归深拷贝对象的属性或数组的元素
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copiedObj[key] = deepCopy(obj[key], visited);
    }
  }
  return copiedObj;
}

import axios from 'axios';
export default {
  name: 'PiHomework',
  data() {
    return {
      suclesson: [],
      loading: true,
      chosehomework: {},
      index: null,//获取所选行的下标
      dialogFormVisible: false,
      score: 0,
    }
  },
  methods: {

    handleEdit(scope) {//查看详情
      this.chosehomework = deepCopy(scope.row);
      this.dialogFormVisible = true;
      this.index = scope.$index;
    },
    //修改时间格式
    formatDate(time) {
      const dateStr = time; // 获取日期字符串，例如 "2023-07-28T08:39:21.000+00:00"
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    PiHomeworks() {
      //this.suclesson.splice(scope.$index, 1)
      this.loading = true
      axios({
        method: 'post',
        url: 'http://localhost:8081/assignment/correcting?assignment_id=' + this.chosehomework.assignmentId + '&credit=' + this.score,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(resp => {
        if (resp.data.code == 2003) {
          this.$notify({
            title: '消息',
            message: (resp.data.msg),
            position: 'bottom-right'
          });
          this.suclesson.splice(this.index, 1)
        }else{
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
          message: ('连接失败'),
          position: 'bottom-right'
        });
        console.log('失败：', err)
        this.loading = false;
      })
    }
  },
  computed: {
    isEmpty() {
      if (this.suclesson.length == 0) {
        return true
      }
      return false
    }
  },
  watch: {
    dialogFormVisible() {
      this.score = 0
    }
  },
  mounted() {
    setTimeout(() => {
      axios({
        method: 'get',
        url: 'http://localhost:8081/assignment/getByCourseIdNO?courseId=' + JSON.parse(localStorage.getItem('choselesson')).courseId,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(resp => {
        this.suclesson = resp.data.data
        this.loading = false
      }).catch(err => {
        this.$notify({
          title: '消息',
          message: ('连接失败'),
          position: 'bottom-right'
        });
        console.log('失败：', err)
        this.loading = false;
      })
    }, 200);
  },
}
</script>

<style scoped>
#view {
  width: 800px;
  padding: 40px 20px 40px 80px;
  background-color: rgb(255, 255, 255);
}

.subBtn {
  position: relative;
  top: 20px;
  width: 120px;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>