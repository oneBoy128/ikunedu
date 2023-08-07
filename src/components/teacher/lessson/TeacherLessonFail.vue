<template>
    <!--审核未通过课程-->
    <div id="conter">
        <div id="view" v-loading="loading">
            <el-empty v-show="isEmpty" description="没有对应的课程信息"></el-empty>
            <el-table height="500" :default-sort="{ prop: 'updateTime' }" v-show="!isEmpty" :data="suclesson" stripe
                style="width: 100%">
                <el-table-column prop="name" label="课程" width="180">
                </el-table-column>
                <el-table-column prop="price" label="价格" width="180">
                </el-table-column>
                <el-table-column prop="subName" label="学科类别">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="formatDate" sortable>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-link type="primary" @click="handleCanel(scope)">取消申请</el-link>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-link type="primary" @click="handleremake(scope.row)">重新申请</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog width="75%" title="课程信息" :visible.sync="dialogFormVisible">
                <FailRemake :dataObj="choselessons"></FailRemake>
            </el-dialog>
        </div>
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
import FailRemake from './FailRemake.vue';
export default {
    name: 'TeacherLessonFail',
    data() {
        return {
            suclesson: [],
            loading: true,
            dialogFormVisible: false,
            choselessons: {},
        }
    },
    methods: {

        handleEdit(row) {//查看详情
            this.choselessons = deepCopy(row);
            this.row = row;
            this.dialogFormVisible = true;
        },
        handleremake(row) {
            this.choselessons = deepCopy(row);
            this.row = row;
            this.dialogFormVisible = true;
            localStorage.setItem('choselesson', JSON.stringify(this.choselessons))
        },

        tocancle(value) {//下架课程前置
            this.$confirm('确认下架课程?!!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cancelLesson(value);
            }).catch(() => {
                this.$notify({
                    type: 'info',
                    message: '已取消',
                    position: 'bottom-right'
                });
            })
        },
        cancelLesson(value) {//下架课程
            console.log(value)
        },
        //修改时间格式
        formatDate(row) {
            const dateStr = row.updateTime; // 获取日期字符串，例如 "2023-07-28T08:39:21.000+00:00"
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        },

        //取消申请
        handleCanel(scope) {//查看详情
            this.choselessons = deepCopy(scope.row);
            this.$confirm('取消申请？也许再改改就能过了:(', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                axios({
                    method: 'post',
                    url: 'http://localhost:8081/course/deleteReq?courseId=' + this.choselessons.courseId,
                }).then(resp => {
                    if (resp.data.code == 2003) {
                        this.suclesson.splice(scope.$index, 1)
                    } else {
                        this.$notify({
                            title: '消息',
                            message: (resp.data.msg),
                            position: 'bottom-right'
                        });
                    }
                    this.loading = false;
                }).catch(err => {
                    console.log('失败：', err)
                    this.loading = false;
                })
            }).catch(() => {
                this.$notify({
                    title: '消息',
                    message: ('操作已取消'),
                    position: 'bottom-right'
                });
            });
        },
    },
    computed: {
        isEmpty() {
            if (this.suclesson.length == 0) {
                return true
            }
            return false
        }
    },
    components: {
        FailRemake
    },
    mounted() {
        setTimeout(() => {
            axios({
                method: 'get',
                url: 'http://localhost:8081/course/getCourse3?userId=' + JSON.parse(localStorage.getItem('users')).id,
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
  
<style></style>