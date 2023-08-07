<template>
    <div id="root" v-loading="loading">
        <div id="mycount"><!--老师课程页面-->
            <div id="tx_counter">
                <div id="tx">
                    <img :src="teacher.imageUrl" style="width: 100%;height: 100%;" alt="教师头像">
                </div>
                <div id="name">{{ teacher.username }}</div>
            </div>
            <div id="lessons"><!--发布的课程-->
                <div id="fabu">发布的课程</div>
                <div id="teacherlessons"><!--老师课程-->
                    <el-row :gutter="10">
                        <el-col v-on:click.native="golesson(item)" class="elCol" :span="3"
                            v-for="(item, index) in suclesson" :key="index" style="margin-left: 5%; margin-bottom: 15%;">
                            <el-card :body-style="{ padding: '3px' }" class="box-card">
                                <el-image :src="item.imageUrl" style="height: 134px;width: 100%;" lazy></el-image>
                            </el-card>
                            <span>{{ item.name }}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "TeachersLesson",
    data() {
        return {
            choselesson: JSON.parse(localStorage.getItem('choselesson')),
            teacher: {},
            loading: false,
            suclesson: []
        }
    },
    methods: {
        golesson(item) {
            this.choselessons = item
            this.$store.state.chosenlesson = item;
            localStorage.setItem('choselesson', JSON.stringify(this.choselessons))
            this.$router.push({
                name: 'WebLesson',
                query: { dataKey: this.choselessons },
            })
        }
    },
    watch: {
        teacher() {
            axios({
                method: 'get',
                url: 'http://localhost:8081/course/getCourse1?userId=' + this.choselesson.userId,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }).then(resp => {
                this.suclesson = resp.data.data
                this.loading = false
            }).catch(err => {
                this.$notify({
                    title: '消息',
                    message: ("连接失败"),
                    position: 'bottom-right'
                });
                console.log('失败：', err)
                this.loading = false;
            })
        }
    },
    mounted() {
        this.loading = true;
        this.choselesson = JSON.parse(localStorage.getItem('choselesson'))
        axios({//获取教师信息
            method: 'post',
            url: 'http://localhost:8081/user/getUser?userId=' + this.choselesson.userId,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(resp => {
            if (resp.data.code == 2004) {
                this.teacher = resp.data.data;
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
        })
    }
}
</script>

<style scoped>
#mycount {
    width: 1300px;
    top: 20px;
    margin-top: 100px;
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
}

#tx_counter {
    width: 100%;
    height: 100px;
    padding-top: 40px;
    line-height: 80px;
    background-color: #ffffff;
    padding-left: 20px;
    display: flex;
}

#tx {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
}

#name {
    font-size: 30px;
    margin-left: 50px;
}

#lessons {
    width: 100%;
    min-height: 400px;
    padding-top: 10px;
    margin-top: 20px;
    line-height: 80px;
    background-color: #ffffff;
    padding-left: 20px;
}

#fabu {
    font-size: 20px;
    padding-bottom: 20px;
}

#teacherlessons {
    width: 100%;
}

.elCol {
    position: relative;
    /* 使用相对定位 */
    text-align: center;
    margin-bottom: 80px;
    height: 150px;
    transition: transform 0.2s;
    z-index: 1;
}

.elCol:hover {
    transform: scale(1.3);
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
    z-index: 5;
}

.box-card img {
    width: 100%;
    height: 100%;
}
</style>