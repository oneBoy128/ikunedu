<template>
    <!--起始页面，整个页面的中心-->
    <div class="TBody">
        <div id="top_nav">

            <div @click="gohome" class="headerBox" style="height: 60px;">
                <h1 style="margin-left:67px; color:rgb(137,137,135)">智学云</h1>
            </div>
            <div class="infoBox">
                <el-input v-model="serchInform" placeholder="请输入内容">
                </el-input>
                <el-button type="primary" @click="serchlesson" style="height: 34px; 
                 width: 67px; 
                 font-size: 13px;
                 border-top-left-radius: 0;
                 border-bottom-left-radius: 0;">搜索</el-button>
            </div>
            <el-menu style="position: sticky; border-bottom: none; background-color:transparent ; margin-right: 40px;"
                :default-active="activeIndex" class="el-menu-demo" mode="horizontal" text-color="rgb(12,12,12)"
                :router="true" :replace="true">
                <el-menu-item class="active el-icon-office-building" index="/">首页</el-menu-item>
                <el-menu-item class="active el-icon-user" v-show="!online" index="/login">登录</el-menu-item>
                <el-menu-item class="active el-icon-user" v-show="online" index="/mycount/myinform">我的账号</el-menu-item>
            </el-menu>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
//let test newnew
export default {
    name: 'MyHome',
    data() {
        return {
            activeIndex: '/',
            serchInform: '',//基本内容信息
        }
    },
    methods: {
        gohome() {
            this.$router.push('/')
        },
        serchlesson() {//去搜索课程吧
            if (this.serchInform != '') {
                localStorage.setItem('serchInform', this.serchInform)
                if (this.$router.currentRoute.path == "/serchlesson") {
                    this.$router.go(0)
                } else {
                    this.$router.replace('/serchlesson')
                }
            } else {
                this.$notify({
                    title: '错误',
                    message: ('搜索内容不能为空'),
                    position: 'bottom-right'
                });
            }
        }
    },
    computed: {
        online() {
            return this.$store.state.isOnline
        }
    },
    mounted() {
        document.title = '智学云';
    }
}
</script>

<style scoped>
.headerBox {
    line-height: 60px;
}

.headerBox:hover {
    cursor: pointer;
}

::v-deep .el-input__inner {
    height: 34px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.active:hover {
    animation: jello;
    animation-duration: 0.5s;
}


#top_nav {
    display: flex;
    justify-content: space-between;
    text-align: center;
    background-color: rgb(255, 255, 255);
    position: sticky;
    top: 0px;
    z-index: 9999;
    min-width: 800px;
}

.searchBox {
    display: inline-block;
    background-color: rgb(255, 63, 41);
    height: 28px;
    border: 2px solid rgb(255, 63, 41);
    padding-top: 3px;
    border-radius: 0 20% 20% 0;
    width: 60px;
}

.searchBox:hover {
    cursor: pointer;
}

.infoBox {
    margin-top: 16px;
    width: 400px;
    display: flex;
}
</style>