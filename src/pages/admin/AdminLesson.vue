<template>
    <div id="conter">
        <div id="view" v-loading="loading">
            <el-table :data="Lessons" style="width: 100%">
                <el-table-column prop="username" label="用户名" width="180">
                </el-table-column>
                <el-table-column prop="name" label="待审核课程" width="180">
                </el-table-column>
                <el-table-column prop="price" label="所需坤分">
                </el-table-column>
                <el-table-column prop="updateTime" label="发布时间" :formatter="formatDate">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link size="mini" style="color: #E69138;" @click="handleEdit(scope, 0)" round>查看详情</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="审核">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="handleEdit(scope, 1)" round>通过</el-button>
                        <el-button size="mini" type="danger" @click="handleDepass(scope)" round>不通过</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 修改课程信息-->
            <el-dialog title="课程信息" :visible.sync="dialogFormVisible">
                <LessonInform :dataObj="choselessons"></LessonInform>
            </el-dialog>
            <el-dialog title="未通过理由" :visible.sync="dialogFormVisible2">
                <el-input type="textarea" :rows="4" :resize="'none'" placeholder="请输入未通过原因" v-model="description"
                    maxlength="200" show-word-limit style="font-size: 18px;">
                </el-input>
                <el-button type="primary" id="bottombtn" @click="submitLesson">提交</el-button>
            </el-dialog>
        </div>
    </div>
</template>
  

<script>
import LessonInform from '@/components/admin/lesson/LessonInform.vue';
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
    name: 'AminLesson',
    data() {
        return {
            loading: true,
            search: '',
            lessons: [],
            dialogFormVisible: false,
            formLabelWidth: '120px',
            choselessons: {},
            row: {},
            dialogFormVisible2: false,//显示审核未通过的理由
            description: '管理员未给出原因',//告诉用户未通过的理由！！
            getscope: null,//获得的scope
        }
    },
    methods: {
        //课程判官
        handleEdit(scope, value) {
            this.choselessons = deepCopy(scope.row);
            this.row = scope.row;
            let obj = {
                courseId: this.choselessons.courseId,
                checked: value,
                reason: this.description
            }
            if (value != 0) {
                this.$confirm('此操作将更改课程状态, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('AdminLessons', obj)
                    setTimeout(() => {
                        this.$store.dispatch('AllLessonAdmin')
                        this.lessons.splice(scope.$index, 1)
                    }, 500)
                    this.$notify({
                        title: '消息',
                        message: ('审核成功'),
                        position: 'bottom-right'
                    });
                    this.dialogFormVisible2 = false
                }).catch(() => {
                    this.$notify({
                        title: '消息',
                        message: ('操作取消'),
                        position: 'bottom-right'
                    });
                });
            } else {
                this.dialogFormVisible = true;
            }
        },
        //给我一个不通过的理由！！！！
        handleDepass(scope) {
            this.choselessons = deepCopy(scope.row);
            this.row = scope.row;
            this.dialogFormVisible2 = true
            this.getscope = scope
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
        submitLesson() {
            this.handleEdit(this.getscope, 2)
        },
    },
    computed: {
        Lessons() {
            this.lessons.forEach(item => {
                if (item.statu == 1) {
                    item.statu = true
                } else {
                    item.statu = false
                }
            })
            return this.lessons
        },
    },
    components: {
        LessonInform
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch('AllLessonAdmin');
            setTimeout(() => {
                this.lessons = this.$store.state.lessons;
                this.loading = false
            }, 800);
        }, 200);
    },
}
</script>

<style scoped>
#conter {
    height: 600px;
    overflow: auto;
}

#bottombtn {
    /*底部按钮*/
    display: block;
    position: relative;
    width: 204px;
    left: 0;
    right: 0;
    top: 10px;
    margin: 0 auto;
}
</style>