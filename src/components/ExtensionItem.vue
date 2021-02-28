<template>
    <div class='ExtensionItem'>
        <div class="item van-hairline--bottom">
            <div class="time-box">
                <span class="date">{{date}}</span>
                <span class="time">{{time}}</span>
            </div>
            <p class="content van-multi-ellipsis--l2">{{data.remark}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ExtensionItem",
        components: {},
        props:['data'],
        data() {
            return {};
        },
        computed: {
            date:function(){
                let ymd = this.data.created_at.split(' ')[0]
                return ymd.split('-')[1]+'-'+ymd.split('-')[2]
            },
            time:function(){
                let hms = this.data.created_at.split(' ')[1]
                return hms.split(':')[0]+':'+hms.split(':')[1]
            }
        },
        created() {
        },
        mounted() {
        },
        destroy() {
        },
        methods: {}
    };
</script>

<style scoped lang="scss">
.ExtensionItem{
    background: #fff;
    padding-left: 50px;
    .item{
        display: flex;
        align-items: center;
        height: 160px;
        .time-box{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            /*margin-right: 55px;*/
            min-width: 135px;
            .date{
                font-size: 36px;
                color: #888888;
                letter-spacing: 0;
                line-height: 44px;
            }
            .time{
                font-size: 26px;
                color: #888888;
                letter-spacing: 0;
            }
        }
        .content{
            padding-right: 50px;
            font-size: 30px;
            color: #333333;
            letter-spacing: 0;
        }
    }
}
</style>
