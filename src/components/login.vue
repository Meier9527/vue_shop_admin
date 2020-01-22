<template>
  <div class="login_container">
    <div class="login_box">
		<div class="avatar_box">
			<img src="../assets/initial.png" alt="">
		</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.login_container{
	background-color: rgb(55, 53, 68);
	height: 100%;
}
.login_box{
	width: 500px;
	height: 350px;
	background-color: #fff;
	border-radius:5px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	.avatar_box{
		height: 130px;
		width: 130px;
		border: 1px solid #ccc;
		border-radius: 50%;
		padding: 10px;
		box-shadow:0 0 10px #eee;
		background-color: #fff;
		position: absolute;
		left:50%;
		transform: translate(-50%,-50%);
		img{
			height: 100%;
			width: 100%;
			border-radius: 50%;
			background-color: #ccc;
		}
	}
}
</style>
