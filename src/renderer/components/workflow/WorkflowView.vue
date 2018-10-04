<template>
    <div>
        <div>
            <el-button-group>
                <el-button icon="el-icon-plus"></el-button>
                <el-button icon="el-icon-edit"></el-button>
                <el-button icon="el-icon-delete"></el-button>
                <el-button icon="el-icon-arrow-up"></el-button>
                <el-button icon="el-icon-arrow-down"></el-button>
            </el-button-group>
            <el-button icon="el-icon-check" style="float: right" type="primary"></el-button>
        </div>
        <div v-for="step in data.steps" style="margin-top: 3px">
            <el-button style="width: 100%" @click="itemClick(step)">{{step.name}}</el-button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'workflow-view',
    props: {
      data: {
        type: Object
      },
      click: {
        type: Function
      }
    },
    data () {
      return {
        selection: ''
      }
    },
    methods: {
      itemClick: function (step) {
        this.selection = step
        this.$router.push('/' + step.type)
        this.$emit('item-click', step)
      }
    }
  }
</script>

<style scoped>

</style>