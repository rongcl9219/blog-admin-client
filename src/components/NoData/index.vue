<template>
    <div class="no_data">
        <img :src="noDataImage" alt="">
        <p>什么都没有</p>
    </div>
</template>

<script>
export default {
    name: "NoData",
    data() {
        return {
            noDataImage: require("@/assets/images/default_img/no_data.png")
        }
    }
}
</script>

<style scoped lang="scss">
.no_data {
    margin-top: 7%;
    text-align: center;

    p {
        font-size: 20px;
        color: #222222;
    }
}
</style>
