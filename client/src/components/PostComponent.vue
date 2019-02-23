<template>
  <div class="container">
    <h1>Lightning Image</h1>
    <img class='var-image' v-bind:src='imgURL'>
    <div class="create-post">
      <input type="text" id="create-post" v-model="text" placeholder="Enter image url">
      <button v-on:click="createPost">Post!</button>
    </div>
    <span>Invoice: {{invoice}}</span>
    <hr>
    <p class="error" v-if="error">{{error}}</p>
  </div>
</template>

<script src="http://cdn.socket.io/stable/socket.io.js"></script>
<script>
import PostService from '../PostService';
export default {
  name: 'PostComponent',
  data() {
    return {
      posts: [],
      error: '',
      text: '',
      imgURL: 'https://imgur.com/gallery/viVcTZ5',
      invoice: ''
    }
  },
  sockets: {
    connect() {
      console.log("client connected to socket");
    },
    disconnect() {
      console.log("client disconnected from socket");
    },
    message(data) {
      console.log(`socket message: ${data}`);
      this.getMostRecentPost();
    }
  },
  async created() {
    try {
      //this.$swal('Hello world!');
      this.posts = await PostService.getPosts();
      this.getMostRecentPost();
    } catch(err) {
      this.error = err.message;
    }
  },
  methods: {
    async createPost() {
      this.invoice = await PostService.insertPost(this.text);
      this.posts = await PostService.getPosts();
      await this.getMostRecentPost();
    },
    async deletePost(id) {
      await PostService.deletePost(id);
      this.posts = await PostService.getPosts();
      await this.getMostRecentPost();
    },
    async getMostRecentPost() {
      this.imgURL = await PostService.getMostRecentPost();
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
}

p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.post {
  position: relative;
  border: 1px solid #5bd658;
  background-color: #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.created-at {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 15px 5px 15px;
  background-color: darkgreen;
  color: white;
  font-size: 13px;
}

p.text {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

img.var-image {
  max-width: 100%;
  height: auto;
  width: auto\9; /* ie8 */
}
</style>
