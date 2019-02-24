<template>
  <div class="container">
  <div class="topnav">
    <img class="topimg" src="..\assets\lightningEmojiSmall.png">
    <a href="#">Lightning Image</a>
      <div class="topnav-right">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
  </div>
  <body>
    <img class='var-image' v-bind:src='imgURL'>
    <div class='caption-content'> {{ caption }} </div>
    <hr>
    <div class="create-post">
      <input type="text" id="create-post" v-model="text" placeholder="Enter image url">
      <button v-on:click="createPost">Post!</button>
    </div>
    <span>Invoice: {{invoice}}</span>
    <hr>
    <div class="create-post-2">
      <input type="text" id="create-post-2" v-model="inputCaption" placeholder="Enter caption">
      <button v-on:click="createCaption">Post!</button>
    </div>
    <span>Invoice: {{invoice2}}</span>
    <hr>
    <!--  <qr-code text="lnbc10u1pw8p4fupp5n5qhh56v7mjc4zr2nzg5yc5j70k05v85z939h34474ck9kpx5j3sdqlxycrqvpqwdshgueqvfjhggr0dcsry7qcqzysd5r5ravasu90algac9meze450tf0q7tktkmgl38th8hymy7sfy2jh02du8ajs6e03lehj5xznw7n6xl7l0q30hvu96tdmyjp9a8x46cppwa0pn"></qr-code>-->
    <p class="error" v-if="error">{{error}}</p>
  </body>
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
      invoice: '',
      invoice2: '',
      inputCaption: '',
      caption: 'Lightning Caption'
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
    },
    captionMsg(data) {
      console.log(`socket message: ${data}`);
      this.getMostRecentCaption();
    }
  },
  async created() {
    try {
      //this.$swal('Hello world!');
      this.posts = await PostService.getPosts();
      this.getMostRecentPost();
      this.getMostRecentCaption();
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
    },
    async getMostRecentCaption() {
      this.caption = await PostService.getMostRecentCaption();
    },
    async createCaption() {
      this.invoice2 = await PostService.insertCaption(this.inputCaption);
      await this.getMostRecentCaption();
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
.topnav {
  overflow: hidden;
  background-color: #333;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.active {
  background-color: #4CAF50;
  color: white;
}

.topnav-right {
  float: right;
}

img.topimg {
  height: 30px;
  margin-left: 10px;
  margin-top: 10px;
  float: left;
}

div.topnav {
  background-color: rgb(168, 168, 168);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  box-shadow: 0 0 25px 0 rgb(168, 168, 168);
}

div.header-right {
  float: right;
}

body {
  margin-top: 50px;
  padding: 10px;
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

div.caption-content {
  font-size:1.5rem;
  display: block;
  padding-bottom:2rem;
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
