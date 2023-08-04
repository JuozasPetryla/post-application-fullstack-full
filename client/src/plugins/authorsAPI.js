import axios from "axios";

const authorsAPI = store => {
    store.http = axios.create({ baseURL: SERVER_ADDR + '/api' })

    store.getAuthors = async function (page) {
        try {
            const response = await this.http.get(`/authors?page=${page}&per_page=${POSTS_PER_PAGE}`)
            if (response.status === 404) {
                throw new Error('Authors not found.')
            }
            return response.data
        } catch (err) {
            return err
        }
    }
    store.getAuthorsWithPosts = async function (page) {
        try {
            const response = await this.http.get(`/authors/posts?page=1&per_page=15`)
            if (response.status === 404) {
                throw new Error('Authors not found.')
            }
            return response.data
        } catch (err) {
            return err
        }

    }
    store.getCurrentAuthorWithPosts = async function (authorId) {
        const response = await this.http.get(`/authors/${authorId}/posts`)
        return response.data
    }
    store.getCurrentAuthor = async function (authorId) {
        const response = await this.http.get(`/authors/${authorId}`)
        return response.data
    }
    store.createNewAuthor = async function (authorObj) {
        const response = await this.http.post('/authors', authorObj)
        return response.data
    }
    store.editAuthor = async function (authorEditedObj) {
        const newObj = authorEditedObj
        const newObjId = authorEditedObj.id
        const response = await this.http.put(`/authors/${newObjId}`, {
            ...newObj
        })
        return response.data
    }
    store.deleteAuthor = async function (authorDeleteId) {
        const response = await this.http.delete(`/authors/${authorDeleteId}`)
        return response.data
    }
}

export default authorsAPI