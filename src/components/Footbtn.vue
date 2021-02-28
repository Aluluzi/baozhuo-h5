<template>
	<div class="footbtn">
		<div class="btn-box">
			<van-button class="primary" :disabled="disabled" @click="click_btn">{{text}}</van-button>
      <div class="box-shaow"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Footbtn',
		data() {
			return {}
		},
		props: ['text','disabled'],
		created() {},
		mounted() {},
		methods: {
			click_btn(){
				this.$emit('click_btn')
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.footbtn{
		//background: #fff;
		//position: fixed;
		//left: 0;
		//bottom: 0;
		//width: 100%;
    //padding: 0 32px;
		.btn-box{
      position: relative;
			.primary{
				background: #21AEC3;
				width: 100%;
				height: 88px;
				font-size: 36px;
				color: #FFFFFF;
				border: 0;
				border-radius: 8px;
        position: relative;
        z-index:5;
			}
      .box-shaow{
        position: relative;
        top: -24px;
        width: 100%;
        height: 24px;
        background: #21AEC3;
        border-radius: 8px;
        opacity: 0.8;
        filter: blur(20px);
      }
		}
	}
	//@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
	//	.footbtn{
	//		background-color: #F5F5F5;
	//		.btn-box{
	//			padding: 12px 15px 34px 15px;
	//			.primary{
	//				height: 88px;
	//				border-radius: 5px;
	//			}
	//		}
	//	}
	//}
	//@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
	//	.footbtn{
	//		background-color: #F5F5F5;
	//		.btn-box{
	//			padding: 12px 15px 34px 15px;
	//			.primary{
	//				height: 88px;
	//				border-radius: 5px;
	//			}
	//		}
	//	}
	//}
</style>
