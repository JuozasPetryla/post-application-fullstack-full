import axios from "axios";

const postsAPI = store => {
    store.http = axios.create({ baseURL: SERVER_ADDR + '/api' })

    store.getPosts = async function (page) {
        try {
            const response = await this.http.get(`/posts?page=1&per_page=15`)
            if (response.status === 404) {
                throw new Error('Posts not found')
            }
            return response.data
        } catch (err) {
            return err
        }
    }
    store.getPostsWithAuthors = async function (page) {
        try {
            const response = await this.http.get(`/posts/authors?page=${page}&per_page=${POSTS_PER_PAGE}`)
            if (response.status === 404) {
                throw new Error('Posts not found')
            }
            return response.data
        } catch (err) {
            return err
        }
    }
    store.getCurrentPostWithAuthor = async function (postId) {
        const response = await this.http.get(`/posts/${postId}/authors`)
        return response.data
    }
    store.getCurrentPost = async function (postId) {
        const response = await this.http.get(`/posts/${postId}`)
        return response.data
    }
    store.createNewPost = async function (postObj) {
        const response = await this.http.post('/posts', postObj)
        return response.data
    }
    store.editPost = async function (postEditedObj) {
        const newObj = postEditedObj
        const newObjId = postEditedObj.id
        const response = await this.http.put(`/posts/${newObjId}`, {
            ...newObj
        })
        return response.data
    }
    store.deletePost = async function (postDeleteId) {
        const response = await this.http.delete(`/posts/${postDeleteId}`)
        return response.data
    }
    store.getSearchedPosts = async function (searchTerm, page) {
        const responseData = await this.http.get(`/posts?page=${page}&per_page=${POSTS_PER_PAGE}&search=${searchTerm}`)
        return responseData.data
    }
    store.getSearchedPostsWithAuthors = async function (searchTerm, page) {
        const responseData = await this.http.get(`/posts/authors?page=${page}&per_page=${POSTS_PER_PAGE}&search=${searchTerm}`)
        return responseData.data
    }
}

export default postsAPI