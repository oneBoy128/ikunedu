<template>
    <div id="conter" v-loading="loading">
        <div id="mycount">
            <el-empty v-show="isEmpty" description="没有对应的课程信息"></el-empty>
            <div v-if="!isEmpty">
                <p>提交时间：{{ formatDate(this.homework.time) }}</p>
                <p>作业状态: {{ isPi }}</p>
                <p v-if="this.homework.statu != 0">获得学分: {{ this.homework.credit }}</p>
                <el-tooltip v-if="this.homework.statu != 0" class="item" effect="dark" content="作业已批改，无法再次修改"
                    placement="top-start">
                    <el-link v-if="this.homework.statu != 0" disabled @click="xiu">修改作业</el-link>
                </el-tooltip>
                <el-link v-if="this.homework.statu == 0" @click="xiu">修改作业</el-link>
                <br>
                <el-link :href="this.homework.assignmentUrl">作业文件</el-link>
            </div>
        </div>
        <div v-show="showshow" id="xiuconter">
            添加作业附件：<input type="file" id="lessonfile" @change="handleFileChange">
            <br>
            <div style="margin-left: 22px; margin-top: 20px;"><el-button type="primary"
                    @click="subHomeWork">修改作业</el-button>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
export default {
    name: 'HomeworkConter',
    data() {
        return {
            homework: {},
            loading: false,
            userId: JSON.parse(localStorage.getItem('users')).id,
            courseId: JSON.parse(localStorage.getItem('choselesson')).courseId,
            showshow:false,//显示修改容器
            assignmentUrl:null,//修改作业的东西
        }
    },
    methods: {
        //修改时间格式
        formatDate(time) {
            const dateStr = time; // 获取日期字符串，例如 "2023-07-28T08:39:21.000+00:00"
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        },
        xiu() {
            this.showshow = !this.showshow
        },
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
                            this.assignmentUrl = null;
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
                    url: 'http://localhost:8081/assignment/updateAssignment',
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
                    if(resp.data.code == 2003){
                        this.$router.go(0)
                    }
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
    },
    computed: {
        isEmpty() {
            if (this.homework == null) {
                return true
            }
            return false
        },
        isPi() {//是否已批改作业
            if (this.homework.statu == 0) return "未批改"
            return "已批改"
        }
    },
    mounted() {
        this.loading = true
        axios({
            method: 'get',
            url: 'http://localhost:8081/assignment/getByCourseId?userId=' + JSON.parse(localStorage.getItem('users')).id + '&courseId=' + JSON.parse(localStorage.getItem('choselesson')).courseId,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(resp => {
            if (resp.data.code == 2004) {
                this.homework = resp.data.data
                console.log(this.homework)
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
                message: ('连接失败'),
                position: 'bottom-right'
            });
            console.log('失败：', err)
            this.loading = false;
        })
    }
}
</script>

<style scoped>
#mycount {
    padding: 10px 10px;
    width: 900px;
    background-color: rgb(255, 255, 255);
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
}
#xiuconter{
    width: 900px;
    padding: 10px 10px;
    background-color: rgb(255, 255, 255);
    height: 120px;
    margin-top: 30px;
}
</style>