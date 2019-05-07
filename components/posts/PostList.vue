<template>
    <section class="post-list">
        <PostPreview 
            v-for="post in posts"
            :key="post.id"
            :id="post.id"
            :is-admin="isAdmin"
            :title="post.title"
            :thumbnail="post.thumbnail"
            :previewText="post.previewText"
        />
        <!-- <PostPreview 
            id="2"
            :is-admin="isAdmin"
            title="Hello there - second post"
            thumbnail="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgI4p9GeZ4VHfj-0rs19uf5lA3aO4sWeaUk4XpzUUBJeSiPDAo_g"
            previewText="This is my second post !"
        />
        <PostPreview 
            id="3"
            :is-admin="isAdmin"
            title="Hi !"
            thumbnail="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgI4p9GeZ4VHfj-0rs19uf5lA3aO4sWeaUk4XpzUUBJeSiPDAo_g"
            previewText="This is my third post !"
        /> -->
    </section>
</template>

<script>
import PostPreview from '@/components/posts/PostPreview'
export default {
    components: {
        PostPreview
    },
    props: {
        isAdmin: {
            type: Boolean,
            default: false
        },
        posts: {
            type: Array,
            required: true
        }
    }
}
</script>

<style scoped>
    .post-list {
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
</style>
