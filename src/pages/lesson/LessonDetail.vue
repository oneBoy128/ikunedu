<template>
    <div id="root"><!--课程详情呀-->
        <div id="mycount">
            <div id="leftcount"><!--左侧栏目-->
                <div>
                    <el-row>
                        <el-col :span="24">
                            <el-menu class="el-menu-vertical-demo" @select="handleOpen" replace :router="true"
                                :unique-opened="true" :default-active="activeIndex">
                                <el-menu-item index="/lessondetail/detailinform">
                                    <i class="el-icon-edit"></i>
                                    <span slot="title">课程详情</span>
                                </el-menu-item>
                                <el-menu-item index="/lessondetail/filelesson">
                                    <i class="el-icon-s-order"></i>
                                    <span slot="title">课件</span>
                                </el-menu-item>
                                <el-submenu index="3" v-show="isStudent">
                                    <template slot="title">
                                        <i class="el-icon-reading"></i>
                                        <span slot="title">作业</span>
                                    </template>
                                    <el-menu-item v-show="isStudent" index="/lessondetail/subhomework">
                                        <span slot="title">提交作业</span>
                                    </el-menu-item>
                                    <el-menu-item v-show="isStudent" index="/lessondetail/homeworkconter">
                                        <span slot="title">查看以往作业</span>
                                    </el-menu-item>
                                </el-submenu>
                                <el-menu-item v-show="isStudent" index="/lessondetail/talklesson">
                                    <i class="el-icon-chat-square"></i>
                                    <span slot="title">评论课程</span>
                                </el-menu-item>
                                <el-submenu index="3" v-show="isTeacher">
                                    <template slot="title">
                                        <i class="el-icon-reading"></i>
                                        <span slot="title">作业</span>
                                    </template>
                                    <el-menu-item v-show="isTeacher" index="/lessondetail/pihomework">
                                        <i class="el-icon-reading"></i>
                                        <span slot="title">批改作业</span>
                                    </el-menu-item>
                                    <el-menu-item v-show="isTeacher" index="/lessondetail/piedhomework">
                                        <i class="el-icon-reading"></i>
                                        <span slot="title">查看已批改的作业</span>
                                    </el-menu-item>
                                </el-submenu>

                            </el-menu>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LessonDetail',
    data() {
        return {
            lesson: JSON.parse(localStorage.getItem('choselesson')),//存放点击的课程
            activeIndex: this.$route.path,
            role: JSON.parse(localStorage.getItem('users')).role
        }
    },
    methods: {
        goweblesson() {
            this.$router.push('/weblesson')
        },
        goauthor() {
            alert('以后做作者跳转页面')
        },
        gochange(value) {
            this.$router.push(value)
        },
        handleOpen(key, keyPath) {
            this.defaults = keyPath[1]
        },
    },
    computed: {
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
        //判断该用户是否是管理员
        isAdmin() {
            if (this.Role == '管理员') return true;
            return false
        },

        //判断该用户是否是老师
        isTeacher() {
            if (this.Role == "老师") return true;
            return false;
        },

        //判断该用户是否是学生
        isStudent() {
            if (this.Role == "学生") return true;
            return false;
        },
    },
    mounted() {
        this.lesson = JSON.parse(localStorage.getItem('choselesson'))
    }
}
</script>

<style scoped>
#mycount {
    width: 1300px;
    padding-top: 40px;
    top: 20px;
    margin-top: 20px;
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
}

#leftcount {
    padding: 12px;
    border-radius: 8px;
    min-height: 280px;
    max-height: 408px;
    margin-right: 50px;
    width: 290px;
    background-color: #ffffff;
}

#leftcount ul {
    padding: 12px;
    border-radius: 8px;
    margin: 0;
    width: auto;
}

#leftcount li {
    margin-bottom: 8px;
}

.leftchao {
    display: block;
    text-decoration: none;
    height: 48px;
    border-radius: 12px;
    line-height: 48px;
    font-size: 14px;
    color: #666666;
}

.leftchao:hover {
    cursor: pointer;
    background-color: #e9fbf5 !important;
    color: #00cc7e;
}

.icon {
    font-size: 18px;
    margin-left: 10px;
    margin-right: 10px;
}
</style>