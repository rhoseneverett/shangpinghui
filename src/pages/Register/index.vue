<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        <span>注册新用户</span>
        <span class="go">
          我有账号，去<router-link to="/login">登陆</router-link>
        </span>
      </h3>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="手机号" prop="number">
          <el-input v-model="ruleForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div style="overflow: hidden">
            <el-input
              v-model="ruleForm.code"
              autocomplete="off"
              style="float: left; width: calc(100% - 110px)"
            ></el-input>
            <el-button
              style="width: 100px; float: right"
              @click="getCode">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password1">
          <el-input
            type="password"
            v-model="ruleForm.password1"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="同意协议" prop="agree">
          <el-checkbox v-model="ruleForm.agree"
            >同意协议并注册《尚品汇用户协议》</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >完成注册</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    // 自定义验证规则：验证两次密码是否一致
    const validatePassword1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        number: "",
        code: "",
        password: "",
        password1: "",
        agree: false,
      },
      rules: {
        number: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
        password1: [
          { required: true, validator: validatePassword1, trigger: "blur" },
        ],
        agree: [
          { required: true, message: "请同意用户协议", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    async getCode() {
      try {
        await this.$store.dispatch("getCode", this.ruleForm.number);
        this.ruleForm.code = this.$store.state.user.code;
      } catch (error) {
        alert(error);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            const { number, code, password } = this.ruleForm;
            let phone = number;
            this.$store.dispatch("register", { phone, code, password });
            this.$router.push("/login");
          } catch (error) {
            alert(error);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 1200px;
  height: 600px;
  margin: auto;
  position: relative;
  border: 1px solid rgb(223, 223, 223);
}

h3 {
  background: #ececec;
  margin: 0;
  padding: 6px 15px;
  color: #333;
  border-bottom: 1px solid #dfdfdf;
  font-size: 20.04px;
  line-height: 30.06px;
}

.go {
  font-size: 14px;
  float: right;
}

.el-form {
  width: 20vw;
  position: absolute; /* 绝对定位 */
  left: 50%; /* 定位到父容器的中心 */
  top: 50%;
  transform: translate(-50%, -50%);
}

li {
  display: inline-block;
  margin-right: 10px;
}

.copyright {
  text-align: center;
  position: absolute;
  bottom: 20px; 
  left: 50%;
  transform: translateX(-50%);
}
</style>