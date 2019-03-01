<template>
  <div class="container">
  <div class="topnav">
    <img class="topimg" src="../assets/lightningEmojiSmall.png">
    <div class="titleText ml-3 text-x1 text-grey-darker" href="#">Lightning Image</div>
      <div class="topnav-right">
        <a href="#" class="btn btn-block" v-b-modal.modal-faq>FAQ</a>
        <b-modal ref="faqModal" id="modal-faq" ok-only cenetered scrollable title="FAQ">
        <p class="my-4"><b>What is this?</b></p>
        <p class="my-4">Just a picture and a caption. Feel free to pay with lightning to change them</p>
        <p class="my-4"><b>What does it cost?</b></p>
        <p class="my-4">The base price is 1000 satoshis. Every post doubles the price. Every five minutes the price is cut in half. The max is 500,000 satoshis.</p>
        </b-modal>
      </div>
  </div>
  <body class="jBod">
    <b-img center class="var-image center-block" v-bind:src='imgURL'/>
    <div style="text-align:center;" class='caption-content'> {{ caption }} </div>
    <hr>
    <div class="create-post">
      <div class = "row text-center">
      <input class="create-post-input" type="text" id="create- post" v-model="text" placeholder="Enter image url">
      <button class="create-post-btn" v-on:click="createPost" v-b-modal.modal-tall>Post for {{imgCost}} sats</button>
      <!-- Modal Component -->
      <b-modal ref="imageModal" id="modal-tall" ok-only centered scrollable title="Lightning invoice">
        <p class="my-4">{{this.invoice}}</p>
        <hr>
        <p>
        <qrcode :value='invoice' :options="{ width: 200 }"></qrcode>
        </p>
      </b-modal>
      </div>
    </div>
    <hr>
    <div class="create-post-2">
      <div class = "row text-center">
          <input class="create-post-input" type="text" id="create-post-2" v-model="inputCaption" placeholder="Enter caption">
          <button class="create-post-btn" v-on:click="createCaption" v-b-modal.modal-tall-caption>Post for {{captionCost}} sats</button>
          <b-modal ref="captionModal" id="modal-tall-caption" ok-only centered scrollable title="Lightning invoice">
            <p class="my-4">{{this.invoice2}}</p>
            <hr>
            <p>
            <qrcode :value='invoice2' :options="{ width: 200 }"></qrcode>
            </p>
          </b-modal>
      </div>
    </div>
    <hr>
    <p class="error" v-if="error">{{error}}</p>
  </body>
  </div>
</template>

<script src="http://cdn.socket.io/stable/socket.io.js"></script>
<script src="sweetalert2/dist/sweetalert2.all.min.js"></script>
<script>
import PostService from '../PostService';
import Swal from 'sweetalert2';
export default {
  name: 'PostComponent',
  title () {
    return 'Lightning Image';
  },
  iconPaths: {
       favicon16: 'favicon.ico',
  },
  data() {
    return {
      posts: [],
      error: '',
      text: '',
      imgURL: 'https://imgur.com/gallery/viVcTZ5',
      invoice: 'Loading...',
      invoice2: 'Loading...',
      inputCaption: '',
      caption: 'Lightning Caption',
      imgCost: '1000',
      captionCost: '1000'
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
      this.getImageCost();
      this.closePostPopup();
      this.text = '';
    },
    captionMsg(data) {
      console.log(`socket message: ${data}`);
      this.getMostRecentCaption();
      this.getCaptionCost();
      this.closeCaptionPopup();
      this.inputCaption = '';
    }
  },
  async created() {
    document.title = "Lightning Image";
    try {
      this.posts = await PostService.getPosts();
      this.getMostRecentPost();
      this.getMostRecentCaption();
      this.getImageCost();
      this.getCaptionCost();
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
    async getImageCost() {
      this.imgCost = await PostService.getImageCost();
    },
    async getCaptionCost() {
      this.captionCost = await PostService.getCaptionCost();
    },
    async createCaption() {
      this.invoice2 = await PostService.insertCaption(this.inputCaption);
      await this.getMostRecentCaption();
    },
    async closePostPopup() {
      this.$refs.imageModal.hide();
    },
    async closeCaptionPopup() {
      this.$refs.captionModal.hide();
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
  background-color: transparent;
  height: 100%;
}
.topnav {
  overflow: hidden;
  background-color:rgb(0, 0, 0);
}

div.titleText {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 22px 0px;
  text-decoration: none;
  font-size: 14px;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 22px 35px;
  text-decoration: none;
  font-size: 14px;
}

.jBod {
  background-color: transparent;
  height: 100%;
}

.modal-body p {
  word-wrap: break-word;
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
  height: 20px;
  margin-left: 28px;
  margin-top: 22px;
  float: left;
}

div.topnav {
  background-color: rgb(140, 140, 140);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 65px;
  box-shadow: 0 0 25px 0 rgb(140, 140, 140);
}

div.header-right {
  float: right;
}

body {
  margin-top: 65px;
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

.create-post-input {
  display: block;
  margin-left : auto;
  margin-right : auto;
}

.imgCostStyle {
  display: block;
  margin-left : auto;
  margin-right : auto;
}
.capCostStyle {
  display: block;
  margin-left : auto;
  margin-right : auto;
}

.create-post-btn {
  display: block;
  margin-left : auto;
  margin-right : auto;
}

div.caption-content {
  font-size:1.5rem;
  display: block;
  margin: auto;
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
