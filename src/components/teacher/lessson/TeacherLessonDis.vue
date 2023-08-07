<template>
    <!--下架课程-->
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
                <el-table-column label="详情">
                    <template slot-scope="scope">
                        <el-link type="primary" v-on:click.native="golesson(scope.row)">查看详情</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="课程信息" :visible.sync="dialogFormVisible">
                <LessonInform :dataObj="choselessons"></LessonInform>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import LessonInform from '@/components/admin/lesson/LessonInform.vue';
export default {
    name: 'TeacherLessonDis',
    data() {
        return {
            suclesson: [],
            loading: true,
            dialogFormVisible: false,
            choselessons: {},
        }
    },
    methods: {

        golesson(item) {//查看详情
            this.choselessons = item
            this.$store.state.chosenlesson = this.choselessons.statu;
            console.log('choselesson', this.choselessons)
            localStorage.setItem('choselesson', JSON.stringify(this.choselessons))
            this.$router.push({
                name: 'WebLesson',
                query: { dataKey: this.choselessons },
            })
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
        LessonInform
    },
    mounted() {
        setTimeout(() => {
            axios({
                method: 'get',
                url: 'http://localhost:8081/course/getCourse4?userId=' + JSON.parse(localStorage.getItem('users')).id,
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