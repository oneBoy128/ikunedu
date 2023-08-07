<template>
    <div id="root">
        <div id="mycount" v-loading="loading">
            <div id="imgconter">
                <div id="imgConter">
                    <!-- 显示上传的图片 -->
                    <img :src="lesson.imageUrl" alt="上传的头像" style="width: 90%;height: 95%;" />
                </div>
                <div id="buttonConter">
                    <input type="file" id="avatarInput" @change="handleFileChange">
                </div>
            </div>
            <div class="informConter">
                <el-input placeholder="课程名" v-model="lesson.name">
                    <template slot="prepend"><i class="el-icon-edit"></i>课程名</template>
                </el-input>
                <el-input placeholder="所需坤分" v-model="lesson.price">
                    <template slot="prepend"><i class="el-icon-s-finance"></i>所需坤分</template>
                </el-input>
                <el-select v-model="selectedSubjectType" placeholder="请选择课程类型">
                    <el-option-group v-for="(subjects, subjectType) in subjectData" :key="subjectType" :label="subjectType"
                        v-on:click.native="toggleSubjects(subjectType)">
                        <el-option v-for="subject in subjects" class="suboption" :key="subject" :label="subject"
                            :value="subject" v-show="isSubjectExpanded(subjectType)" />
                    </el-option-group>
                </el-select>
                <el-input type="textarea" :rows="4" :resize="'none'" placeholder="请输入课程描述" v-model="lesson.description"
                    maxlength="200" show-word-limit style="font-size: 18px;">
                </el-input>
                <div style="padding-top: 5px;">
                    修改课程附件：<input type="file" id="lessonfile" @change="handleFile">
                    <br>
                    <el-link :href="lesson.contentUrl">{{ lesson.contentUrl }}</el-link>
                </div>
                <div style="display: flex;">
                    <el-button type="primary" class="bottombtn" @click="submitLesson">提交</el-button>
                </div>
            </div>
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
    name: 'FixLesson',
    data() {
        return {
            lesson: {},//修改课程
            loading: false,
            perImg: null,
            subjectData: {}, // 用于存储后端返回的学科信息
            expandedSubjects: [], // 用于记录展开的一级标题
            selectedSubjectType: JSON.parse(localStorage.getItem('choselesson')).subName,
            selectedSubject: null,
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        handleFileChange(event) {//这是上传头像的操作
            const fileInput = event.target;
            const selectedFile = fileInput.files[0];

            // 检查文件大小是否符合限制（以字节为单位）
            const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
            //检查是否选择文件  
            if (selectedFile) {
                if (selectedFile.size > maxSizeBytes) {
                    alert("上传的文件大小超过限制，请选择小于5MB的文件。");
                    fileInput.value = ""; // 清空文件输入框，阻止上传
                    return;
                }
                // 使用 FileReader 读取文件内容并转换为数据 URL
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.lesson.imageUrl = e.target.result; // 将数据 URL 设置为预览图片的 src
                };
                reader.readAsDataURL(selectedFile);
                //检查lesson对象是否有空值(这是头像图片的上传)
                var avatarInput = document.getElementById('avatarInput');
                var file = avatarInput.files[0];
                var formData = new FormData();
                formData.append('avatar', file);
                //上传图片文件的接口
                if (avatarInput != null) {
                    this.$store.dispatch("uploadImgNormal", formData);
                    setTimeout(() => {
                        this.lesson.imageUrl = this.$store.state.IMGURL
                    }, 1000);
                }
            } else {
                this.lesson.imageUrl = null; // 清除预览图片
            }
        },
        handleFile(event) {//这是上传课程附件的函数
            const fileInput = event.target;
            const selectedFile = fileInput.files[0];

            // 验证是否选择了文件
            if (!selectedFile) {
                alert("请选择文件");
                return;
            }

            // 验证文件类型是否为txt
            if (selectedFile.type !== "text/plain") {
                alert("只能上传txt文件");
                fileInput.value = ""; // 清空文件输入框，阻止上传
                return;
            }

            // 验证文件大小是否符合限制（以字节为单位）
            const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
            if (selectedFile.size > maxSizeBytes) {
                alert("上传的文件大小超过限制，请选择小于5MB的文件。");
                fileInput.value = ""; // 清空文件输入框，阻止上传
                return;
            }

            const formData2 = new FormData();
            formData2.append("avatar", selectedFile);
            //上传图片文件的接口
            this.$store.dispatch("uploadFile", formData2);
            setTimeout(() => {
                if (this.$store.state.FILEURL != null) {
                    this.lesson.contentUrl = this.$store.state.FILEURL
                }
            }, 1000)


        },

        toggleSubjects(subjectType) {
            // 切换展开状态
            if (this.expandedSubjects.includes(subjectType)) {
                this.expandedSubjects = this.expandedSubjects.filter((subject) => subject !== subjectType);
            } else {
                this.expandedSubjects.push(subjectType);
            }
        },
        isSubjectExpanded(subjectType) {
            // 检查一级标题是否展开
            return this.expandedSubjects.includes(subjectType);
        },
        fetchData() {//用户点击slect会触发
            //使用 axios 发送 GET 请求获取所有课程数据
            axios({
                method: 'get',
                url: 'http://localhost:8081/subject/getAll',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(resp => {
                this.subjectData = resp.data.data;
            })
        },

        submitLesson() {
            this.lesson.subName = this.selectedSubjectType
            const values = Object.values(this.lesson);
            for (const value of values) {
                if (value === null) {
                    // 有空值，弹出提示
                    this.$notify({
                        title: '消息',
                        message: ('缺少对应信息，请填写完整'),
                        position: 'bottom-right'
                    });
                    return;
                }
            }
            console.log(this.lesson)
            // 使用axios发送POST请求将lesson对象数据提交到后端接口
            axios({
                method: 'post',
                url: 'http://localhost:8081/course/updateCheckNo',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(this.lesson),
            })
                .then((resp) => {
                    if (resp.data.code == 2005) {
                        this.$notify({
                            title: '消息',
                            message: ('成功提交课程'),
                            position: 'bottom-right'
                        });
                        // 这里可以进行其他逻辑处理，比如跳转到其他页面或清空表单等操作
                        this.$router.replace('/mycount/teacherLesson/normal')
                    } else {
                        this.$notify({
                            title: '消息',
                            message: (resp.data.msg),
                            position: 'bottom-right'
                        });
                    }
                    this.loading = false;
                })
                .catch(() => {
                    // 请求失败后的处理逻辑
                    this.$notify({
                        title: '消息',
                        message: ('连接失败'),
                        position: 'bottom-right'
                    });
                    this.loading = false
                });
        },
    },
    mounted() {
        this.lesson = deepCopy(JSON.parse(localStorage.getItem('choselesson')))
        // 在组件挂载后获取所有课程数据
        this.fetchData('');
    }
}
</script>

<style scoped>
#mycount {
    /*大容器*/
    width: 1300px;
    top: 20px;
    margin-top: 20px;
    padding: 40px 20px 40px 80px;
    background-color: rgb(255, 255, 255);
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
}

#imgConter {
    width: 400px;
    height: 400px;
    overflow: hidden;
}

.informConter {
    width: 60%;
    display: flex;
    height: 480px;
    flex-direction: column;
    margin-top: 30px;
    justify-content: space-evenly;
}

.bottombtn {
    /*底部按钮*/
    display: block;
    position: relative;
    width: 130px;
    left: 0;
    right: 0;
    top: 40px;
    margin: 0 auto;
}
</style>