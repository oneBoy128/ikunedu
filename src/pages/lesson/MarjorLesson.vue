<template>
    <div id="root" v-loading=loading>
        <div id="top">
            <div class="top_conter"><!--放置内容的东西-->
                <h1 class="c-name">{{ major }}</h1>
                <div class="c-border"></div>
                <span class="c-item" id="active" @click="chosemajor">全部</span>
                <span class="c-item" @click="chosemajor" v-for="subject in majorlist" :key="subject">{{ subject }}</span>
            </div>
        </div>
        <div id="mycount">
            <el-empty v-show="isEmpty" description="课程为空，快去发表你的第一个作品吧"></el-empty>
            <div style="display: flex; flex-wrap: wrap;">
                <div v-on:click="golesson(item)" class="elCol" v-for="(item, index) in lessonList" :key="index">
                    <div style="height: 158px;width: 100%;overflow: hidden;position: relative;">
                        <el-card :body-style="{ padding: '3px' }" class="box-card">
                            <el-image class="images" :src="item.imageUrl" lazy></el-image>
                        </el-card>
                    </div>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'MarjorLesson',
    data() {
        return {
            major: localStorage.getItem('marjor'),//存放主科
            lessonList: [],//查找出来的课程
            majorlist: [],//被选择的主科的小类
            loading: false,
            choselessons: null,//被选择的课程
            subject: null,//存放小类科目
        }
    },
    methods: {
        chosemajor(value) {/**选择课程 */
            let buts = document.querySelectorAll('.c-item')
            buts.forEach(item => item.id = '')
            value.target.id = 'active'
            this.loading = true
            if (value.target.textContent == '全部') {
                axios({
                    method: 'get',
                    url: 'http://localhost:8081/course/getByCategory?category=' + localStorage.getItem('marjor'),
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(resp => {
                    if (resp.data.code == 2004) {
                        this.lessonList = resp.data.data
                    } else {
                        this.$notify({
                            title: '消息',
                            message: (resp.data.msg),
                            position: 'bottom-right'
                        });
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    this.$notify({
                        title: '错误',
                        message: ('网络出错了'),
                        position: 'bottom-right'
                    });
                    console.log('出错了', err)
                })
            } else {
                axios({
                    method: 'get',
                    url: 'http://localhost:8081/course/getBySubName?subName=' + value.target.textContent,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(resp => {
                    if (resp.data.code == 2004) {
                        this.lessonList = resp.data.data
                    } else {
                        this.$notify({
                            title: '消息',
                            message: (resp.data.msg),
                            position: 'bottom-right'
                        });
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    this.$notify({
                        title: '错误',
                        message: ('网络出错了'),
                        position: 'bottom-right'
                    });
                    console.log('出错了', err)
                })
            }
        },
        golesson(item) {
            this.choselessons = item
            this.$store.state.chosenlesson = item;
            localStorage.setItem('choselesson', JSON.stringify(this.choselessons))
            if (this.$route.path !== '/weblesson') {
                this.$router.push('/weblesson'); // 导航到目标路由
            }
        }
    },
    computed: {
        isEmpty() {
            if (this.lessonList.length == 0) {
                return true
            }
            return false
        }
    },
    watch: {
        majorlist() {
            setTimeout(() => {
                let buts2 = document.querySelectorAll('.c-item')
                let targetIndex = -1; // 初始化目标下标为 -1，表示未找到目标
                // 遍历元素并查找目标文本对应的元素下标
                for (const [index, element] of buts2.entries()) {
                    const text = element.textContent;
                    if (text === this.subject) {
                        targetIndex = index;
                        element.id = 'active'
                        break; // 找到目标后结束循环
                    }
                }
                console.log(targetIndex)
            }, 100);
        }
    },
    mounted() {
        this.loading = true
        this.major = localStorage.getItem('marjor'),//存放主科
        this.subject = localStorage.getItem('subject')
        let buts = document.querySelectorAll('.c-item')
        buts.forEach(item => item.id = '')

        if (this.subject == '全部') {
            axios({
                method: 'get',
                url: 'http://localhost:8081/course/getByCategory?category=' + localStorage.getItem('marjor'),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(resp => {
                if (resp.data.code == 2004) {
                    this.lessonList = resp.data.data
                } else {
                    this.$notify({
                        title: '消息',
                        message: (resp.data.msg),
                        position: 'bottom-right'
                    });
                }
                setTimeout(() => {
                    this.loading = false
                }, 500);
            }).catch(err => {
                this.$notify({
                    title: '错误',
                    message: ('网络出错了'),
                    position: 'bottom-right'
                });
                setTimeout(() => {
                    this.$router.go(0)
                }, 500);
                console.log('出错了', err)
            })
        } else {
            axios({
                method: 'get',
                url: 'http://localhost:8081/course/getBySubName?subName=' + this.subject,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(resp => {
                if (resp.data.code == 2004) {
                    this.lessonList = resp.data.data
                } else {
                    this.$notify({
                        title: '消息',
                        message: (resp.data.msg),
                        position: 'bottom-right'
                    });
                }
                setTimeout(() => {
                    this.loading = false
                }, 500);
                this.loading = false
            }).catch(err => {
                this.loading = false
                this.$notify({
                    title: '错误',
                    message: ('网络出错了'),
                    position: 'bottom-right'
                });
                console.log('出错了', err)
            })
        }
        //所有学科的科目
        axios({
            method: 'get',
            url: 'http://localhost:8081/subject/getAll',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(resp => {
            this.majorlist = resp.data.data[this.major];
            setTimeout(() => {
                this.loading = false
            }, 500);
        }).catch(err => {
            this.$notify({
                title: '错误',
                message: ('网络出错了'),
                position: 'bottom-right'
            });
            this.loading = false
            setTimeout(() => {
                this.$router.go(0)
            }, 500);
            console.log('失败：', err)
        })

    }
}
</script>

<style scoped>
#top {
    /*顶端的容器*/
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
}

.top_conter {
    /**顶端内容区 */
    width: 1200px;
    margin: 0 auto;
    padding: 15px 0;
}

.images{
    position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.c-name {
    /**主科名 */
    display: inline-block;
    font-size: 24px;
    font-weight: 600;
    color: #333;
    line-height: 33px;
    margin: 0;
}

.c-item {
    /**头部的标签 */
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: #666;
    line-height: 22px;
    padding: 5px 16px;
    display: inline-block;
}

.c-item:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 18px;
}

.lesson {
    /**存放课程的容器 */
    cursor: pointer;
    position: relative;
    width: 224px;
    height: 252px;
    border-radius: 8px;
    background: #fff;
    font-size: 0;
}

.elCol {
    position: relative;
    width: 166px;
    height: 206px;
    border-radius: 8px;
    margin-right: 50px;
    margin-bottom: 40px;
    font-size: 16px;
    background: #fff;
    text-align: center;
}

.elCol:hover {
    transform: scale(1.3);
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
    z-index: 5;
}

.box-card {
    cursor: pointer;
    width: 100%;
    max-height: 230px;
    overflow: hidden;
}

#active {
    /**被点击的按钮 */
    background: #00cc7e;
    border-radius: 18px;
    color: #fff;
}

.c-border {
    /**分割线 */
    width: 1px;
    height: 16px;
    background: #e6e6e6;
    margin: 0 32px;
}

#mycount {
    /**下部分展示课程的容器 */
    width: 1300px;
    padding-top: 40px;
    top: 20px;
    margin-top: 100px;
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
}
</style>