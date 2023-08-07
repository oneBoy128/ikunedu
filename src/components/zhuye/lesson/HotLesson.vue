<template>
    <div id="root" v-loading=loading>
        <div id="mycount">
            <div class="lessonTitle">热门课程</div>
            <el-empty v-show="isEmpty" description="暂无课程"></el-empty>
            <div style="display: flex; flex-wrap: wrap; margin-left: 117px;">
                <div v-on:click="golesson(item)" class="elCol" v-for="(item, index) in lessonList" :key="index">
                    <div style="height: 158px;width: 100%;overflow: hidden;position: relative;">
                        <el-card :body-style="{ padding: '3px',height: '168px'}" class="box-card">
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
            loading: false,
            choselessons: null,//被选择的课程
        }
    },
    methods: {
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
    mounted() {
        this.loading = true
        axios({
            method: 'get',
            url: 'http://localhost:8081/course/getPopularCourses',
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
            this.$notify({
                title: '消息',
                message: ('连接失败'),
                position: 'bottom-right'
            });
            console.log('失败', err)
        })

    }
}
</script>

<style scoped>
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

.lessonTitle{
    color: #333;
    font-size: 24px;
    margin-left: 41px;
    font-weight: 500;
    margin-bottom: 47px;
}

.images{
    position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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

#mycount {
    /**下部分展示课程的容器 */
    width: 1300px;
    padding-top: 40px;
    top: 20px;
    margin-top: 100px;
    position: relative;
    background: #f8f8f8;
    left: 0;
    right: 0;
    margin: 0 auto;
}
</style>