import Vuex from 'vuex';
import axios from 'axios';
import Cookie from 'js-cookie';


const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: [],
            token: null
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts;
            },
            addPost(state, post) {
                state.loadedPosts.push(post);
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(
                    post => post.id === editedPost.id
                );
                state.loadedPosts[postIndex] = editedPost;
            },
            setToken(state, token) {
                state.token = token;
            },
            clearToken(state) {
                state.token = null;
            }
        },
        actions: {
            nuxtServerInit(vuexContext, context) {
                //return axios.get(process.env.baseUrl + '/posts.json')
                return context.app.$axios.$get('/posts.json')
                    .then(data => {
                        const postsArray = []
                        for (const key in data) {
                            postsArray.push({...data[key], id: key })
                        }
                        vuexContext.commit('setPosts', postsArray)
                    })
                    .catch(e => context.error(e));
            },
            setPosts(vuexContext, posts) {
                vuexContext.commit('setPosts', posts)
            },
            addPost(vuexContext, postData) {
                const createPost = {
                    ...postData,
                    updateDate: new Date()
                }
                return this.$axios.$post('/posts.json?auth=' + vuexContext.state.token, createPost)
                    .then(res => {
                        console.log("res: ", res);
                        vuexContext.commit('addPost', {...createPost, id: res.name })
                    })
                    .catch(e => console.log(e))

            },
            editPost(vuexContext, editedPost) {

                return this.$axios.$put('/posts/' +
                        editedPost.id + '.json?auth=' + vuexContext.state.token, editedPost)
                    .then(res => {
                        // console.log(res)
                        // this.$router.push('/admin')
                        vuexContext.commit('editPost', editedPost)
                    })
                    .catch(e => console.log(e))
            },
            authenticateUser(vuexContext, authData) {

                let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.fbAPIKey

                if (!authData.isLogin) {
                    authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + process.env.fbAPIKey
                }

                return this.$axios.$post(authUrl, {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                }).then(result => {
                    // console.log(result)
                    vuexContext.commit('setToken', result.idToken);
                    localStorage.setItem('token', result.idToken);
                    localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
                    Cookie.set('jwt', result.idToken);
                    Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(result.expiresIn) * 1000);
                    // vuexContext.dispatch('setLogoutTimer', result.expiresIn * 1000);
                }).catch(e => console.log(e));

            },
            // setLogoutTimer(vuexContext, duration) {
            //     setTimeout(() => {
            //         vuexContext.commit('clearToken');
            //     }, duration);
            // },
            initAuth(vuexContext, req) {
                let token;
                let expirationDate;
                if (req) {
                    if (!req.headers.cookie) {
                        return;
                    }
                    const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
                    if (!jwtCookie) {
                        return;
                    }
                    token = jwtCookie.split('=')[1];

                    expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate='))
                        .split('=')[1];

                } else if (process.client) {
                    token = localStorage.getItem('token');
                    expirationDate = localStorage.getItem('tokenExpiration');
                    console.log("date: " + new Date().getTime());
                    console.log("expirationDate: ", +expirationDate);
                }

                if (new Date().getTime() > +expirationDate || !token) {
                    console.log('No token or invalid token');
                    // vuexContext.commit('clearToken');
                    vuexContext.dispatch('logout');
                    return;
                }
                // vuexContext.dispatch('setLogoutTimer', +expirationDate - new Date().getTime())
                vuexContext.commit('setToken', token);
            },
            logout(vuexContext) {
                vuexContext.commit('clearToken');
                Cookie.remove('jwt');
                Cookie.remove('expirationDate');
                if (process.client) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiration');
                }
            }

        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            },
            isAuthenticated(state) {
                return state.token != null
            }
        }
    })
}

export default createStore;