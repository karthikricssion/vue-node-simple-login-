function User(obj){
  this._id = obj._id || null
  this.email = obj.email || null
  this.username = obj.username || null
  this.password = obj.password || null
  this.profile_completed = obj.profile_completed || false
}

User.prototype.checkEmail = function() {
  return axios.post('/check-email?email='+this.email).then(function(response) {
    return response.data
  }).catch(function(error) {
    console.log(error)
  })
}

User.prototype.checkUsername = function() {
  return axios.post('/check-username?username='+this.username).then(function(response) {
    return response.data
  }).catch(function(error) {
    console.log(error)
  })
}

User.prototype.register = function() {
  return axios.post('/register', this).then(function(response) {
    return response.data
  }).catch(function(error) {
    console.log(error)
  })
}

User.prototype.login = function() {
  return axios.post('/login', this).then(function(response) {
    if(!response.data.auth) {
      return response.data
    } else {
      window.location = response.data.redirect
    }
  }).catch(function(error) {
    console.log(error)
  })
}