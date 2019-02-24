import axios from 'axios';

const url = 'api/posts/';
const captionUrl = 'api/posts/captions/';

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
                const mainPostUrl = 'api/posts/main/';
                const res = await axios.get(mainPostUrl);
                console.log('res from main: ');
                console.log(res.data);
                resolve(res.data);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Get Most Recent Caption
    static getMostRecentCaption() {
        return new Promise(async (resolve, reject) => {
            try {
                var result = 'Lightning Caption';
                const mainCaption = 'api/posts/main/caption';
                const res = await axios.get(mainCaption);
                console.log('res from main caption: ');
                console.log(res.data);
                resolve(res.data);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Create Post
    static insertPost(text){
        //if (text.slice(-4) === '.jpg') {
        //if ((/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/).test(text)) {
        if (true) {
            var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'bd5ecb21-6fba-4cfa-949c-a5c70149ad27'
            };
            var body = '{ \"amount\": 100, \"callback_url\": \"http://69.141.47.76:5008/api/posts/update\" }';

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
                console.log(`insertPost returning: ${response.data.data.lightning_invoice.payreq}`);
                return response.data.data.lightning_invoice.payreq;
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

    // Insert caption
    static insertCaption(text){
        var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'bd5ecb21-6fba-4cfa-949c-a5c70149ad27'
        };
        var body = '{ \"amount\": 100, \"callback_url\": \"http://69.141.47.76:5008/api/posts/update/captions\" }';

        console.log(`time to do some caption lightning!`);
        return axios.post('https://dev-api.opennode.co/v1/charges', body, {headers: headers})
        .then(function (response) {
            if (response.status === 201) {
                console.log(`new charge_id: ${response.data.data.id}`);
                axios.post(captionUrl, {
                    text: text,
                    charge_id: response.data.data.id
                });
            }
            console.log(response);
            console.log(`insertCaption returning: ${response.data.data.lightning_invoice.payreq}`);
            return response.data.data.lightning_invoice.payreq;
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    // Delete Post
    static deletePost(id){
        return axios.delete(`${url}${id}`);
    }
}

export default PostService;