

<script>
import Header from './components/layout/Header.vue'
import Nav from './components/layout/Nav.vue'
import Article from './components/layout/Article.vue'
import Footer from './components/layout/Footer.vue'


export default {
  name: 'app',
  components: {
    Header,
    Nav,
    Article,
    Footer,
  }
}
</script>

<template>
  <v-app id="app">
    <Header />
    <div id="main">
      <Article>
          <router-view></router-view>
      </Article>
      <Nav />
    </div>
    <Footer/>
  </v-app>
</template>