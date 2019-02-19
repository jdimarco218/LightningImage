import axios from 'axios';

const url = 'api/posts/';

class PostService {
    // Get Posts
    static getPosts() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                resolve(
                    data.map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                );
            } catch(err) {
                reject(err);
            }
        });
    }

    // Get Most Recent Post
    static getMostRecentPost() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                //console.log(`getMostRecentPost(): ${data[data.length - 1].text}`);
                resolve(data[data.length - 1].text);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Create Post
    static insertPost(text){
        if (text.slice(-4) === '.jpg') {
            var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'bd5ecb21-6fba-4cfa-949c-a5c70149ad27'
            };
            var body = '{ \"amount\": 100 }';

            return axios.post('https://dev-api.opennode.co/v1/charges', body, {headers: headers})
            .then(function (response) {
                console.log(responser);
            })
            .catch(function (error) {
                console.log(error);
            })
            console.log(`time to do some lightning!`);
        } else {
            return axios.post(url, {
                text: text
            });
        }
    }

    // Delete Post
    static deletePost(id){
        return axios.delete(`${url}${id}`);
    }
}

export default PostService;