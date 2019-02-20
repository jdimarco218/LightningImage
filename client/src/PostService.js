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
                var result = 'https://i.imgur.com/viVcTZ5.png';
                //data.array.forEach(element => {
                //    if (element.)
                //});
                const mainPostUrl = 'api/posts/main/';
                const res = await axios.get(mainPostUrl);
                console.log('res from main: ');
                console.log(res.data);
                //console.log(`getMostRecentPost(): ${data[data.length - 1].text}`);
                //resolve(data[data.length - 1].text);
                resolve(res.data);
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
            var body = '{ \"amount\": 100, \"callback_url\": \"http://69.141.47.76:5000/api/posts/update\" }';

            console.log(`time to do some lightning!`);
            return axios.post('https://dev-api.opennode.co/v1/charges', body, {headers: headers})
            .then(function (response) {
                if (response.status === 201) {
                    console.log(`new charge_id: ${response.data.data.id}`);
                    axios.post(url, {
                        text: text,
                        charge_id: response.data.data.id
                    });
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
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