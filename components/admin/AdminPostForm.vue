<template>
    <form @submit.prevent="onSave">
        <AppControlInput v-model="editedPost.author" >Author Name</AppControlInput>
        <AppControlInput v-model="editedPost.title">Title</AppControlInput>
        <AppControlInput v-model="editedPost.thumbnail">Thumbnail Link</AppControlInput>
        <AppControlInput
            controlType="textarea"
            v-model="editedPost.content"
        >Content</AppControlInput>
        <AppControlInput
            controlType="textarea"
            v-model="editedPost.previewText"
        >Preview Text</AppControlInput>
        <AppButton type="submit">Save</AppButton>
        <AppButton 
            type="button"
            style="margin-left:10px"
            btn-style="cancel"
            @click="onCancel">Cancel</AppButton>
    </form>
</template>

<script>
// không cần khai bảo vì đã được khai báo trong 'plugins/core-components'
// import AppButton from '@/components/ui/AppButton'
// import AppControlInput from '@/components/ui/AppControlInput';

export default {
    // components: {
    //     AppButton,
    //     AppControlInput
    // },
    props: {
        post: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            editedPost: this.post 
                ? {...this.post} 
                : {
                    author: '',
                    title: '',
                    thumbnail: '',
                    content: '',
                    previewText: ''
                  }
        }
    },
    methods: {
        onSave(){
            // save the post
            // console.log(this.editedPost)
            this.$emit('submit', this.editedPost)
        },
        onCancel() {
            // navigation back
            console.log("Naviagtion back ");
            this.$router.push("/admin")
        }
    }
}
</script>