<!-- 课程信息模块 -->
<template>
    <div id="root">
        <div id="mycount">
            <div id="topbox"><!--顶端课程信息-->
                <div id="imgconter">
                    <img @click="goweblesson" class="img lessonzi" id="" :src="lesson.imageUrl" width="400" height="300"
                        alt="图片">
                </div>
                <div id="lessoninform">
                    <div @click="goweblesson" class="lessonzi" style="font-size: 25px;
                            color: #333333;
                            margin-right: 6px;
                            font-weight: 600;">{{ lesson.name }}</div>
                    <div class="midbox">
                        <p class="lessonzi"><i class="el-icon-user lessonIcon"></i>任课教师:<span>{{ lesson.author }}</span></p>
                        <p class="lessonzi"><i class="el-icon-edit lessonIcon"></i>课程类别:<span>{{ lesson.subName }}</span>
                        </p>
                        <p><i class="el-icon-alarm-clock lessonIcon"></i>更新时间:<span>{{ formatDate(lesson.updateTime)
                        }}</span></p>
                        <p><i class="el-icon-s-finance lessonIcon"></i>所需坤分:<span>{{ lesson.price }}</span></p>
                        <div class="description-conter"><!--存放描述的盒子-->
                            <p class="description">
                                <i class="el-icon-s-finance lessonIcon"></i>课程描述:<span>{{ getDescriptionDisplay }}</span>
                            </p>
                            <el-link class="description-detail" v-if="this.lesson.description.length > 20 && !show"
                                @click="showDetail" type="info">详情</el-link>
                        </div>
                    </div>
                    <el-button v-show="isTeacher" type="success" @click="xiu" class="lessonbtn" round><span>修改课程</span></el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';
export default {
    name: 'DetailInform',
    data() {
        return {
            role: parseInt(JSON.parse(localStorage.getItem("users")).role),
            lesson: JSON.parse(localStorage.getItem('choselesson')),
            userId: JSON.parse(localStorage.getItem("users")).id
        }
    },
    methods: {
        formatDate(row) {
            const dateStr = row; // 获取日期字符串，例如 "2023-07-28T08:39:21.000+00:00"
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        },
        goweblesson() {
            this.$router.push('/weblesson')
        },
        xiu(){//修改课程
            this.$router.push('/fixlesson')
        }
    },
    computed: {
        ...mapState(['user']),
        Role() {
            let r = null;
            switch (this.role) {
                case 0:
                    r = "管理员";
                    break;
                case 1:
                    r = "老师";
                    break;
                case 2:
                    r = "学生";
                    break;
            }
            return r;
        },
        //更新头像
        avaterUrl() {
            return this.$store.state.avaterImg
        },
        isTeacher(){
            if(this.Role == "老师") return true;
            return false;
        },
        getDescriptionDisplay() {
            if (this.lesson.description.length < 20 || this.show) return this.lesson.description
            return this.lesson.description.slice(0, 20) + "...";
        }
    }
}
</script>

<style scoped>
#mycount {
    /*大容器*/
    width: 982px;
    padding: 10px 10px;
    background-color: rgb(255, 255, 255);
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
}


#topbox {
    /* 顶端容器*/
    width: 100%;
    min-height: 288px;
    padding: 50px 20px;
    border-radius: 20px;
    display: flex;
    justify-content: space-around;
}

#imgconter {
    /**图片容器 */
    width: 375px;
    height: 295px;
}

#lessoninform {
    /**课程信息 */
    width: 452px;
    margin-left: 50px;
}

.midbox {
    /**课程信息中部容器 */
    padding: 4px 19px 16px 16px;
    margin-bottom: 24px;
    background-color: #f8f9fb;
    border-radius: 8px;
    margin-top: 40px;
    z-index: 999;
}

.midbox p {
    /**中部信息段落 */
    color: #666666;
    font-size: 14px;
    padding: 5px 0;
}

.midbox span {
    /**同上 */
    padding-left: 10px;
}

.lessonIcon {
    /**中部信息图标 */
    padding: 0 3px;
}

.lessonbtn {
    /**课程按钮 */
    height: 48px;
    line-height: 15px;
    font-size: 16px;
    margin-top: 28px;
    min-width: 192px;
    font-weight: 600;
    border-radius: 24px;
}

.fail {
    background-color: #666666;
    border: 1px solid #DCDFE6;
}

.description-conter {
    /**存放描述的盒子 */
    display: flex;
    align-items: center;
    font-size: 12px;
}

.description-detail {
    /**详情 */
    text-decoration: none;
}

.lessonzi {
    cursor: pointer;
}
</style>