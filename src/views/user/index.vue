<template>
  <div class="tab-container">
    <div class="menu">
      <el-input placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-button class="filter-item" type="primary" icon="el-icon-search">
        搜索用户
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">
        添加用户
      </el-button>
      <el-checkbox v-model="showRole" class="filter-item" style="margin-left:15px;">
        用户角色
      </el-checkbox>
    </div>
    <!--    添加用户dialog-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" :label-width="formLabelWidth">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="reSass" :label-width="formLabelWidth">
          <el-input v-model="rePass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth">
          <el-select v-model="form.role" placeholder="请选择用户角色">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">添 加</el-button>
      </div>
    </el-dialog>
    <!--    编辑用户dialog-->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" :label-width="formLabelWidth">
          <el-input v-model="editForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="reSass" :label-width="formLabelWidth">
          <el-input v-model="rePass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" :label-width="formLabelWidth">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth">
          <el-select v-model="editForm.role" placeholder="修改用户角色">
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">修 改</el-button>
      </div>
    </el-dialog>
    <el-table
      class="table"
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        v-if="showRole"
        prop="role"
        label="用户角色"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showEditForm(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import { formatTime } from '@/utils/util'

export default {
  name: 'Index',
  data() {
    return {
      showRole: true,
      showReviewer: true,
      userList: [],
      dialogFormVisible: false, // 添加表单弹出控制
      editFormVisible: false, // 编辑表单弹出控制
      formLabelWidth: '100px',
      form: {
        name: '',
        password: '',
        email: '',
        role: '',
        createTime: '',
        operator: '',
        updateTime: ''
      },
      editForm: {
        name: '',
        password: '',
        email: '',
        role: '',
        createTime: '',
        operator: '',
        updateTime: ''
      },
      lastForm: {},
      rePass: ''
    }
  },
  // watch: {
  //   userList(old, newV) {
  //     // for (let i = 0; i < this.userList.length; i++) {
  //     //   // this.userList[i].createTime = formatTime(this.userList[i].createTime)
  //     //   this.userList[i].updateTime = formatTime(this.userList[i].updateTime)
  //     // }
  //     return this.userList
  //   }
  // },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      axios.get('http://localhost:3000/users/', {}).then(res => {
        if (res.status === 200) {
          this.userList = res.data.result
        }
      })
    },
    handleAdd() {
      this.form.operator = localStorage.getItem('username')
      this.form.createTime = new Date().getTime()
      this.form.updateTime = new Date().getTime()
      axios.post('http://localhost:3000/users/add', this.form).then(res => {
        if (res.status === 200) {
          this.userList = res.data.result
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.dialogFormVisible = false
        }
      })
    },
    handleSearch() {
    },
    showEditForm(userInfo) {
      this.lastForm = userInfo
      this.editForm = userInfo
      this.editFormVisible = true
    },
    handleEdit() {
      if (this.lastForm === this.editForm) {
        this.$message({
          type: 'info',
          message: '未作出任何修改'
        })
        this.editFormVisible = false
        return
      }
      this.editForm.updateTime = new Date().getTime()
      axios.post('http://localhost:3000/users/update', this.editForm).then(res => {
        if (res.status === 200) {
          this.userList = res.data.result
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editFormVisible = false
        }
      })
    },
    handleDelete(username) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('http://localhost:3000/users/delete', { username: username }).then(res => {
          if (res.status === 200) {
            this.userList = res.data.result
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .tab-container
    margin 20px
  .table
    margin-top 20px;
  .pagination
    position absolute
    right 20px
    bottom 20px
</style>
