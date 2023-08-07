<template>
    <div id="bottombox"><!--为了方便管理，把WebLesosn页的下部分抽出了这个模块-->
        <div id="left" v-loading="loading"><!--评论区-->
            <div v-if="value != 0" id="rate_infor"><!--评分信息-->
                <p style="line-height: 64px;
                    font-size: 48px;
                    width: 73px;
                    color: #FF7A3E;
                    font-weight: bold;
                    margin-right: 15px;">{{ values }}</p>
                <div>
                    <p><el-rate v-model="value" disabled void-icon-class="icon-rate-face-off"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                        </el-rate></p>
                    <p style="font-size: 13px;
                        color: #999999;">总共有{{ this.number }}条评论</p>
                </div>
            </div>
            <div id="lefts">
                <div style="margin-top: 42px;">
                    <div v-if="this.mytalk !== undefined && this.person != null" style="margin-top: 25px;"><!--自己评论的容器-->
                        <p style="font-size: 20px;">我的评论</p>
                        <div class="talk_suzhis" style="display: flex;"><!--评论盒子-->
                            <div style="width: 90%;">
                                <div class="talker_top"><!--评论区上册-->
                                    <div class="talker_tx"><!--评论区头像-->
                                        <img :src="this.mytalk.imageUrl" style="width: 100%;height: 100%;">
                                    </div>
                                    <div class="talker_top_right"><!--右侧存放名字，评分，发布时间-->
                                        <div style="margin-bottom: 9px; display: flex;"><!--存名字，存评分-->
                                            <span style="color: #333333;
                                    font-size: 13px;
                                    text-decoration: none;
                                    margin-right: 10px;
                                    font-weight: 600;">{{ this.mytalk.username }}</span>
                                            <span><el-rate disabled v-model="this.mytalk.stars"></el-rate></span>
                                        </div>
                                        <div style="color: #999999;"><!--存发布时间-->
                                            发表于：{{ formatDate(this.mytalk.time) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="talker_description"><!--下册存放评论内容-->
                                    {{ this.mytalk.text }}
                                </div>
                            </div>
                            <div class="talk_right"><!--右侧的两个按钮-->
                                <a style="margin-right: 10px;" @click="edit_talk">修改</a>
                                <a @click="delete_talk">删除</a>
                            </div>
                        </div>
                    </div>
                </div>

                <p style="margin-top: 50px;font-size: 20px;" v-show="value != 0">全部评论（{{ number }}）</p>
                <div><!--存放评论的容器-->
                    <el-empty v-show="value == 0" description="暂无评论，快来抢沙发"></el-empty>
                    <div class="talk_suzhis" style="display: flex;" v-for="(talk, index) in talks" :key="index"><!--评论盒子-->
                        <div style="width: 90%;">
                            <div class="talker_top"><!--评论区上册-->
                                <div class="talker_tx"><!--评论区头像-->
                                    <img :src="talk.imageUrl" style="width: 100%;height: 100%;" alt="">
                                </div>
                                <div class="talker_top_right"><!--右侧存放名字，评分，发布时间-->
                                    <div style="margin-bottom: 9px; display: flex;"><!--存名字，存评分-->
                                        <span style="color: #333333;
                                    font-size: 13px;
                                    text-decoration: none;
                                    margin-right: 10px;
                                    font-weight: 600;">{{ talk.username }}</span>
                                        <span><el-rate disabled v-model="talk.stars"></el-rate></span>
                                    </div>
                                    <div style="color: #999999;"><!--存发布时间-->
                                        发表于：{{ formatDate(talk.time) }}
                                    </div>
                                </div>
                            </div>
                            <div class="talker_description"><!--下册存放评论内容-->
                                {{ talk.text }}
                            </div>
                        </div>
                    </div>
                </div>
                <el-dialog title="评论信息" :visible.sync="dialogFormVisible">
                    <div v-if="mytalk != null" style="display: flex;">评分：<span><el-rate
                                v-model="mytalks.stars"></el-rate></span>
                    </div>
                    <el-input v-if="mytalk != null" type="textarea" :rows="4" :resize="'none'" placeholder="请输入你的评论"
                        v-model="mytalks.text" class="textpl" maxlength="200" show-word-limit style="font-size: 18px;">
                    </el-input>
                    <el-button @click="change_talk" style="height: 121px; " type="primary">更改评论</el-button>
                </el-dialog>
            </div>
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

import axios from 'axios'
export default {
    name: 'WebLessonBottom',
    data() {
        return {
            person: JSON.parse(localStorage.getItem("users")),//获取自己
            talks: null,//所有评论
            mytalk: undefined,//自己的评论
            loading: false,
            username: null,//获取自己的名字
            lesson: JSON.parse(localStorage.getItem('choselesson')),//获取被选课程
            number: null,//评论数
            mytalks: null,//到时候要修改评论的
            dialogFormVisible: false,//编辑个人评论
            value: 0,//课程评分
            values: 0,//另一个
        }
    },
    computed: {
        isEmpty() {
            return this.talks == null ? true : false
        }
    },
    methods: {
        subtalk() {
            axios({
                method: 'post',
                url: 'http://localhost:8081/comments/addComment',
                data: JSON.stringify({ courseId: this.lesson.courseId, userId: this.person.id, stars: this.value, text: this.description }),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(resp => {
                if (resp.data.code == 2005) {
                    this.$router.go(0)
                } else {
                    this.$notify({
                        title: '消息',
                        message: (resp.data.msg),
                        position: 'bottom-right'
                    });
                }
            }).catch(err => {
                this.$notify({
                    title: '消息',
                    message: ("连接失败"),
                    position: 'bottom-right'
                });
                console.log('失败：', err)
            })
        },
        //修改时间格式
        formatDate(time) {
            const date = new Date(time);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        },
        edit_talk() {
            this.dialogFormVisible = true
            this.mytalks = deepCopy(this.mytalk)
        },
        change_talk() {//修改评论
            axios({
                method: 'post',
                url: 'http://localhost:8081/comments/changeComment',
                data: JSON.stringify({ courseId: this.mytalks.courseId, stars: this.mytalks.stars, text: this.mytalks.text, userId: this.mytalks.userId, commentsId: this.mytalks.commentsId }),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then((resp) => {
                if (resp.data.code == 2005) {
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
                this.$notify({
                    title: '消息',
                    message: ("连接失败"),
                    position: 'bottom-right'
                });
                console.log('失败：', err)
                this.loading = false
            })
        },
        delete_talk() {
            this.loading = true
            axios({
                method: 'post',
                url: 'http://localhost:8081/comments/delComment?commentId=' + this.mytalk.commentsId,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then((resp) => {
                if (resp.data.code == 2005) {
                    this.talks = this.talks.filter(item => item.commentsId !== this.mytalk.commentsId);
                    this.number -= 1
                    this.mytalk = undefined
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
        }
    },
    mounted() {
        this.loading = true
        if (JSON.parse(localStorage.getItem("users")) != null) {
            this.username = JSON.parse(localStorage.getItem("users")).username//获取自己
        }
        axios({
            method: 'get',
            url: 'http://localhost:8081/comments/getComment?courseId=' + this.lesson.courseId,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then((resp) => {
            this.talks = resp.data.data
            if (this.username != null) {
                this.mytalk = resp.data.data.find(item => item.username == this.username)
                this.mytalks = deepCopy(this.mytalk)
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

        axios({
            method: 'get',
            url: 'http://localhost:8081/comments/getCourseRatingSummary?courseId=' + this.lesson.courseId,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then((resp) => {
            this.number = resp.data.data.num
            this.value = parseFloat(resp.data.data.avgStars)
            this.values = this.value
        }).catch(err => {
            this.$notify({
                title: '消息',
                message: ("连接失败"),
                position: 'bottom-right'
            });
            console.log('获取评论失败：', err)
        })
    }
}
</script>

<style scoped>
#bottombox {
    /**大容器 */
    width: 1300px;
    padding-top: 10px;
    top: 50px;
    position: relative;
    justify-content: space-between;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
}

#left {
    /**左侧栏 */
    width: 100%;
    background-color: rgb(255, 255, 255);
    padding: 0 15px;
    border-radius: 8px;
}

#lefts {
    background-color: rgb(255, 255, 255);
    padding: 0 15px;
    border-radius: 8px;
}

#rate_infor {
    display: flex;
    margin-top: 20px;
    margin-bottom: 16px;
    height: 64px;
    line-height: 64px;
    background: #f8f9fb;
    border-radius: 8px;
    padding: 20px;
}


#left {
    /**左侧栏 */
    width: 100%;
    background-color: rgb(255, 255, 255);
    padding: 0 15px;
    border-radius: 8px;
}

#right {
    /**右侧栏 */
    width: 323px;
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
}

.infomation_tabs {
    /**左边的上册栏 */
    padding-top: 30px;
    font-size: 24px;
    border-bottom: 1px solid #e6e6e6;
}

.infomation_tabs_tab {
    padding-bottom: 8px;
}

.talk_tabs {
    /**评论区 */
    margin-top: 20px;
    display: flex;
}

#talk_tx {
    width: 135px;
    height: 135px;
    border-radius: 50%;
    margin-right: 30px;
    overflow: hidden;
    /* 确保图片在圆形容器内显示 */
}

.round-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 调整图片填充方式，保持图片比例并填充满容器 */
    border-radius: 50%;
    /* 让图片也变成圆形 */
}

.textpl {
    width: 82%;
}

.start {
    margin-left: 10px;
}

.talk_suzhis {
    /**素质盒子 */
    padding-top: 20px;
    border-bottom: 1px solid #e6e6e6;
}

.talker_top {
    /**上册素质盒子 */
    display: flex;
    align-items: center;
    height: 75px;
}

.talker_tx {
    /**存放头像的盒子 */
    height: 60px;
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
}

.talker_top_right {
    /**右侧存放名字，评分，发布时间 */
    margin-left: 17px;
    font-size: 13px;
}

.talker_description {
    /**存放评论 */
    color: #666666;
    font-size: 14px;
    position: relative;
    line-height: 24px;
    padding: 12px 0 20px 0;
    word-break: break-word;
}

.talk_right {
    display: none;
    position: relative;
    height: 131px;
    line-height: 131px;
}

.talk_right a:hover {
    cursor: pointer;
    color: #666666;
}

.talk_suzhis:hover .talk_right {
    display: block;
}
</style>

