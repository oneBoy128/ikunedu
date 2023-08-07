import VueRouter from "vue-router";
import Home from '../pages/zhuye/Home.vue';
import MyCount from '../pages/user/MyCount.vue'
import MyInfrom from '../components/user/MyCount/MyInform.vue'
import MyFix from '../components/user/MyCount/MyFix.vue'
import Login from '../pages/user/Login.vue'
import YeMian from '../pages/zhuye/YeMian.vue'
import Register from '../pages/user/Register.vue'
import AdminStudent from '../pages/admin/AdminStudent.vue'
import AdminTeacher from '../pages/admin/AdminTeacher.vue'
import MyTest from '../pages/MyTest.vue'
import AdminLesson from '../pages/admin/AdminLesson.vue'
import TeacherLesson from '../pages/teacher/TeacherLesson.vue'
import TeacherLessonSuc from '../components/teacher/lessson/TeacherLessonSuc.vue'
import TeacherLessonNorm from '../components/teacher/lessson/TeacherLessonNorm.vue'
import TeacherLessonFail from '../components/teacher/lessson/TeacherLessonFail.vue'
import TeacherLessonDis from '../components/teacher/lessson/TeacherLessonDis.vue'
import AddLesson from '../pages/teacher/AddLesson.vue'
import WebLesson from '../pages/lesson/WebLesson.vue'
import SafeHelper from '../pages/user/SafeHelper.vue'
import ForgetHelper from '../pages/user/ForgetHelper.vue'
import AdminRole from '../pages/admin/AdminRole.vue'
import FixLesson from '../pages/lesson/FixLesson.vue'
import MarjorLesson from '../pages/lesson/MarjorLesson.vue'
import SerchLesson from '../pages/lesson/SerchLesson.vue'
import MyLesson from '../pages/student/MyLesson.vue'
import LessonDetail from '../pages/lesson/LessonDetail.vue'
import DetailInform from '../components/lessons/DetailInform.vue'
import FileLesson from '../components/lessons/FileLesson.vue'
import TalkLesson from '../components/lessons/TalkLesson.vue'
import PiHomework from '../pages/lesson/PiHomework.vue'
import PiedHomework from '../pages/lesson/PiedHomework.vue'
import SubHomework from '../components/lessons/SubHomework.vue'
import HomeworkConter from '../components/lessons/HomeworkConter.vue'
import CheackHomework from '../components/teacher/lessson/CheackHomework.vue'
import TeachersLesson from '../pages/lesson/TeachersLesson.vue'


const router = new VueRouter({
    routes:[
        {
            path:'/',
            meta:{isAuth:true},
            component:Home,
            redirect:'/yemian',
            children:[
                {   
                    //这是param参数的接受要求，首先要申明name然后在path上用：进行占位操作
                    path:'mycount',
                    name:'Login',
                    meta:{isAuth:true,requiresAuth: true},
                    component: MyCount,
                    //可在params参数的传递中直接配置props进行参数的简化，后继可以直接props接受使用
                    props:true,
                    children:[
                        {
                            path: 'myinform',
                            component: MyInfrom
                        },
                        {
                            path:'myfix',
                            component:MyFix
                        },
                        {
                            path:'adminstudent',
                            component: AdminStudent
                        },
                        {
                            path:'adminteacher',
                            component: AdminTeacher
                        },
                        {
                            path:'adminlesson',
                            component: AdminLesson,
                        },
                        {
                            path:'adminrole',
                            component:AdminRole
                        },
                        {
                            path:'teacherlesson',
                            component: TeacherLesson,
                            children:[
                                {
                                    path:'success',
                                    component: TeacherLessonSuc,
                                },
                                {
                                    path:'normal',
                                    component:TeacherLessonNorm
                                },
                                {
                                    path:'fail',
                                    component: TeacherLessonFail
                                },
                                {
                                    path:'dis',
                                    component:TeacherLessonDis
                                },
                            ]
                        },
                        {
                            path:'addlesson',
                            component: AddLesson
                        },
                        {
                            path:'mylesson',
                            component:MyLesson
                        },
                        {
                            path:'cheackhomework',
                            component: CheackHomework
                        }
                    ]
                },
                {
                    path:'yemian',
                    component:YeMian,
                    meta:{isAuth:true}
                },
                {
                    path:'weblesson',
                    name:"WebLesson",
                    component: WebLesson
                },
                {
                    path:'teacherslesson',
                    component: TeachersLesson
                },
                {
                    path:'safehelper',
                    name:'safehelper',
                    component: SafeHelper
                },
                {
                    path:'fixlesson',
                    name:'fixlesson',
                    component: FixLesson
                },
                {
                    path:'marjorlesson',
                    name:'marjorlesson',
                    component:MarjorLesson
                },
                {
                    path:'serchlesson',
                    name:'serchlesson',
                    component: SerchLesson
                },
                {
                    path:'lessondetail',
                    component: LessonDetail,
                    children:[
                        {
                            path:'detailinform',
                            component:DetailInform
                        },
                        {
                            path:'filelesson',
                            component: FileLesson
                        },
                        {
                            path:'talklesson',
                            component: TalkLesson
                        },
                        {
                            path:'pihomework',
                            component: PiHomework
                        },
                        {
                            path:'piedhomework',
                            component: PiedHomework
                        },
                        {
                            path:'subhomework',
                            component: SubHomework
                        },
                        {
                            path:'homeworkconter',
                            component: HomeworkConter
                        }
                    ]
                }
            ]
        },
        {
            path:'/login',
            name:'login',
            component:Login
        },
        {
            path:'/register',
            name:'register',
            component:Register
        },
        {
            path:'/test',
            name:'test',
            component:MyTest
        },
        {
            path:'/forget',
            name:'forget',
            component:ForgetHelper
        },
    ],
})

router.beforeEach((to, from, next) => {
    // 让页面回到顶部
    if(to.meta.isAuthenticated){
        const isOnline = localStorage.getItem("isOnline")
        if(isOnline){
            document.documentElement.scrollTop = 0;
            next()
        }else{
            if(confirm('该功能需要登陆，你要登陆吗？')) router.push({path:'/login'})
        }
    }else{
        if(to.meta.isAuth){
            document.documentElement.scrollTop = 0;
        }
        next()
    }
});


export default router