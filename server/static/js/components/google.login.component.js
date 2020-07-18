Vue.component('google-sign-in', {
  template: '<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>',
  methods: {
    onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); 
      console.log('Full Name: ' + profile.getName());
      console.log('Given Name: ' + profile.getGivenName());
      console.log('Family Name: ' + profile.getFamilyName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());

      var id_token = googleUser.getAuthResponse().id_token;
      console.log("ID Token: " + id_token);
    }
  }
})