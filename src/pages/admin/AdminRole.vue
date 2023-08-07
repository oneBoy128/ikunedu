<template>
    <div id="conter">
            <div id="view" v-loading="loading">
                <el-table
                :data="Waitroles"
                style="width: 100%">
                    <el-table-column
                        prop="username"
                        label="用户名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handlepass(scope,1)">通过</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handlepass(scope,3)">不通过</el-button>
                        </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
  </template>
  

  <script>
    import axios from 'axios';

  //深拷贝数据--------------------------------------------------------------------
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

    //vue----------------------------------------------------------------------------------------------------------------------------
    export default {
      name:'AdminRole',
      data() {
        return {
          loading:true,
          search: '',
          waitroles:[],
          formLabelWidth: '120px',
          chosewaitroles:{},
          row:{},
        }
      },
      methods:{
        handlepass(scope,value) {
            this.chosewaitroles = deepCopy(scope.row);
            this.row = scope.row;
            axios({
                method:'post',
                url:'http://localhost:8081/user/checkTeacher?username='+this.chosewaitroles.username+'&statu='+value,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            }).then((resp)=>{
                console.log(resp)
                this.waitroles.splice(scope.$index,1)
            }).catch(err=>{
                console.log('失败：',err)
            })
        },
        handleDelete(row) {
            console.log(row);
        },
        changeStatu(row){
            this.chosewaitroles = deepCopy(row);
            if(row.statu == true){
                this.chosewaitroles.statu = 1;
            }else{
                this.chosewaitroles.statu = 0;
            } 
            this.$store.dispatch("ChangeState",this.chosewaitroles);
        }
      },
      computed:{
        Waitroles(){
            this.waitroles.forEach(item=>{
                if(item.statu == 1){
                    item.statu = true
                }else{
                    item.statu = false
                }
            })
                return this.waitroles
            },
        },
      mounted() {
        setTimeout(() => {
            this.$store.dispatch('AllWait');
            setTimeout(() => {
                this.waitroles = this.$store.state.waitroles;
                this.loading = false
            }, 800);
        }, 200);
    },
    }
  </script>
  <style scoped>
  #conter{
      height: 600px;
      overflow: auto;
  }
</style>