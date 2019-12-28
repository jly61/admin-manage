<template>
  <el-table
    :data="list"
    stripe
    style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="level"
      label="预警级别"
      width="180">
    </el-table-column>
    <el-table-column
      prop="time"
      label="时间指标(h)"
      width="180">
    </el-table-column>
    <el-table-column
      prop="element"
      label="气象要素指标"
      width="180">
    </el-table-column>
    <el-table-column
      prop="desc"
      label="指标描述"
    >
    </el-table-column>
    <el-table-column
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="showEditForm(scope.row)">编辑
        </el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row.name)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      list: [],
      currentDisaster: '霜冻'
    }
  },
  mounted() {
    if (this.$route.query.tab !== undefined) {
      this.currentDisaster = this.$route.query.tab
    }
    console.log(this.currentDisaster)
    this.getCrop()
  },
  methods: {
    getCrop() {
      const param = {
        name: this.currentDisaster
      }
      axios.get('http://localhost:3000/disasters', { params: param }).then(res => {
        if (res.status === 200) {
          this.list = res.data.result.norm
        }
      })
    },
    showEditForm(rowInfo) {
      this.$emit('sendEdit', rowInfo)
    },
    handleDelete(username) {
      this.$confirm('此操作将永久删除该指标, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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

