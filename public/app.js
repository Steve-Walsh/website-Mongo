
var myApp = angular.module('myApp',['ngRoute']);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
    	templateUrl: 'partials/main.html',
      controller: 'MainController'
    })
    .when('/posts', {
      templateUrl: 'partials/posts.html',
      controller: 'PostsController'
    })
    .when('/post/:id',
    {
      controller: 'PostsCommentsController',
      templateUrl: './partials/postComments.html'
    })
    .when('/pictures',{
      templateUrl : 'partials/pictures.html',
      controller : 'PicturesController' 
    })

    .when('/picture/:id', {
      templateUrl: 'partials/picture-details.html',
      controller: 'PicutresDetailCtrl'
    })
    .when('/login',{
      templateUrl : 'partials/login.html',
      controller :'UsersController'
    })
    .when('/signup',{
      templateUrl : 'partials/signup.html',
      controller :'UsersController'
    })
    .when('/users',{
      templateUrl : 'partials/users.html',
      controller : 'UsersController'
    })
    .when('/profile/:id',{
      templateUrl : 'partials/profile.html',
      controller : 'UsersController'
    })
    .otherwise({
      redirectTo: '/'
    })
  }])

myApp.controller('MainController', ['$scope' , 'PostsService', 'UsersService' , 'PicturesService', function($scope, PostsService, UsersService, PicturesService){
 $scope.loggedInUser = UsersService.loggedIn();


 PostsService.getPosts()
 .success(function(posts) {
   $scope.posts = posts;
 });

 PicturesService.getPictures()
 .success(function(pictures) {
   $scope.pictures = pictures;
 });

 UsersService.getUsers()
 .success(function(users) {
   $scope.users = users;
 });




}])



myApp.controller('UsersController', ['$scope','$http','$location', '$routeParams', 'UsersService' , 
  function($scope, $http, $location, $routeParams , UsersService){
    UsersService.getUsers()
    .success(function(users) {
     $scope.users = users;
   });

    $scope.loggedInUser = UsersService.loggedIn();
   
    $scope.edit = 'no'


    $scope.orderProp = '+name';

    $scope.quantity = 5;


    $scope.register = function(newAccount){
      register($scope.newAccount);
      $scope.newAccount = '';
    };
    var loggedInUser =null;

    $scope.login = function(userDetails){
      login($scope.userDetails, $scope.users)
      $location.path('/')
      $scope.userDetails = '';
    };


    $scope.remove = function(id) {
      console.log(id);
      $http.delete('/api/users/' + id);
      $location.path('/users')
      console.log($location.path())

    };


    $scope.editAccount = function(){
      $scope.edit = 'yes'
    }
    $scope.save=function(user){

      user._id = $scope.loggedInUser._id
      if(user.name == null){
        user.name = $scope.loggedInUser.name
      }
      if(user.email == null){
        user.email = $scope.loggedInUser.email
      }
      if(user.gender == null){
        user.gender = $scope.loggedInUser.gender
      }
      if(user.phone_num == null){
        user.phone_num = $scope.loggedInUser.phone_num
      }

     $http.put('api/users/' + $routeParams, user);

      //$scope.user = ""
      $scope.edit = 'no'
      //router.get('/:id', controller.view);
      console.log("going to reload" +  $scope.loggedInUser._id + " : " + $routeParams)
      $http.get('api/users/'+ $scope.loggedInUser._id).success(function(user)
      {
        $scope.loggedInUser = user;
        $location.path('/profile/'+$scope.loggedInUser._id);
      })

      
    }
    $scope.cancel = function () {
      $scope.edit = 'no'
      $scope
    }
    
    $scope.logout=function(){
        console.log("logout called")
        logout()
        $location.path('/');
      }


  }])


myApp.factory('UsersService', ['$http', function($http){

  register = function(newAccount){
    $http.post('api/users/registerNewUser', newAccount);
    console.log(newAccount)
  }

  remove = function(id){
    $http.delete('api/users/' + id);
  }
  var loggedInUser=null

  login = function(userDetails, users){
    console.log(userDetails.email)
    users.forEach(function(user){
      if(user.email == userDetails.email){
        console.log("email is right " + user.email + "  -  " + userDetails.email)
        if(user.password == userDetails.password){
          loggedInUser = user;
          console.log("user has logged in " + user.email)
        }
      }
    })


  }

  logout = function(){
      console.log("logout factory function")
      loggedInUser = null
    }


  loggedIn = function(){
    return loggedInUser;
  }

  
  var api = {
    getUsers : function() {
     return $http.get('/api/users')
   },

   loggedIn : function(){
    return loggedInUser;
  }
}
return api
}])




myApp.controller('PostsController', ['$scope', '$http', '$location' ,'PostsService', 'UsersService', function ($scope, $http, $location , PostsService, UsersService) {

  $scope.loggedInUser = UsersService.loggedIn();
  //console.log($scope.loggedInUser.email)

  PostsService.getPosts()
  .success(function(posts) {
   $scope.posts = posts;
 });

  $scope.addPost = function(){
    if($scope.loggedInUser != null){
      $scope.newPost.author = $scope.loggedInUser.name
    }
    console.log("adding post " + $scope.newPost.title)
    addNewPost($scope.newPost);
    $scope.newPost = '';
  }

  $scope.deletPost = function(id) {
    console.log(id);
    $http.delete('/api/posts/' + id);

    PostsService.getPosts()
    .success(function(posts) {
     $scope.posts = posts;
   });

  };



  $scope.orderProp = '-upvotes';
  $scope.quantity = 5;

  //router.post('/:id/upvotes'
    $scope.incrementUpvotes = function(post) {
 //post.upvotes += 1;
 console.log('post id : ' + post._id)
 $http.post('api/posts/' +post._id+'/upvotes', post)
    // .success(function()
    // {
    //   console.log('upvotes added')
    // })
    // .error(function(err, post){
    //   console.log('error : ' + err + ' post : ' + id)
    // })
PostsService.getPosts()
.success(function(posts) {
 $scope.posts = posts;
});
}
$scope.decrementUpvotes = function(post) {
  post.upvotes -= 1;
}
}]) 


myApp.controller('PostsCommentsController', ['$scope', '$routeParams', '$location','$http', 'PostsService', 'UsersService', function($scope, $routeParams, $location, $http , PostsService, UsersService){

  $scope.loggedInUser = UsersService.loggedIn();

  $http.get('/api/posts/post/' + $routeParams.id)
  .success(function(post) {
   $scope.post = post[0]
   console.log(post.title)
 });

  $scope.addComment = function(){
    if($scope.loggedInUser != null){
      $scope.newComment.author = $scope.loggedInUser.name
    }

    addPostComment($scope.post._id, $scope.newComment)
    $scope.newComment=''
    $http.get('/api/posts/post/' + $routeParams.id)
    .success(function(post) {
     $scope.post = post[0]
     console.log(post.title)
   });
  }


}])


myApp.factory('PostsService', ['$http', function($http){

 addNewPost = function(newPost) {
  console.log('in new posts')
  $http.post('/api/posts', newPost).success(function(res)
  {
   console.log ('worked' )
 })
  .error(function(err){
   console.log('error : ' + err)
 })
}

addPostComment = function(post_id, comment) {
  return $http.post('/api/posts/' + post_id + '/comments' ,
    comment)
}

deletPost= function(id){
  $http.delete('api/posts/' + id);
}


var api = {
 getPosts : function() {
   return $http.get('/api/posts')
 },

 upvotePost : function(post_id, new_upvote_count ) {
  return $http.post('/api/posts/' + post._id + '/upvotes', 
   {upvotes: new_upvote_count })
},
upvotePostComment : function(post_id, comment_id, new_upvote_count ) {
  return $http.post( '/api/posts/' +
    post_id + '/comments/' +  comment._id + '/upvotes', 
    {upvotes: new_upvote_count })
},
}
return api
}])




myApp.controller('PicturesController',   ['$scope', '$http' ,'PicturesService', 'UsersService', function($scope, $http , PicturesService, UsersService) {

  $scope.loggedInUser = UsersService.loggedIn();

  PicturesService.getPictures()
  .success(function(pictures) {
   $scope.pictures = pictures;
 });
  $scope.orderProp = 'name';
  $scope.quantity = 5;

  $scope.incrementUpvotes = function(picture) {
 //post.upvotes += 1;
 console.log('picture id : ' + picture._id)
 $http.post('api/pictures/' +picture._id+'/upvotes', picture)

 PicturesService.getPictures()
 .success(function(pictures) {
   $scope.pictures = pictures;
 });
}




$scope.addPicture = function(){
  if($scope.loggedInUser != null){
    $scope.newPicture.author = $scope.loggedInUser.name
  }
  console.log("adding picture " + $scope.newPicture)
  addNewPicture($scope.newPicture);
  $scope.newPicture = '';
}
}])

myApp.factory('PicturesService', ['$http', function($http){

 addNewPicture = function(newPicture) {
   $http.post('/api/pictures', newPicture).success(function(res)
   {
     console.log ('worked' )
   })
   .error(function(err){
     console.log('error : ' + err)
   })
 }

 addPictureComment = function(post_id, comment) {
  return $http.post('/api/posts/' + post_id + '/comments' ,
    comment)
}

  //   deletPost= function(id){
  //     $http.delete('api/posts/' + id);
  // }


  var api = {
   getPictures : function() {
     return $http.get('/api/pictures')
   }

     // upvotePost : function(post_id, new_upvote_count ) {
     //      return $http.post('/api/posts/' + post._id + '/upvotes', 
     //                 {upvotes: new_upvote_count })
     // },
     // upvotePostComment : function(post_id, comment_id, new_upvote_count ) {
     //      return $http.post( '/api/posts/' +
     //                  post_id + '/comments/' +  comment._id + '/upvotes', 
     //                 {upvotes: new_upvote_count })
     // }
   }
   return api
 }])





myApp.controller('PicutresDetailCtrl', 
 ['$scope', '$routeParams', '$http', 'UsersService', 'PicturesService', 
 function($scope, $routeParams, $http , UsersService ,PicturesService) {

  $scope.loggedInUser = UsersService.loggedIn();

  $http.get('/api/pictures/picture/' + $routeParams.id)
  .success(function(picture) {
   $scope.picture = picture[0]
   console.log(picture.title)
 });

  $scope.addComment = function(){
    if($scope.loggedInUser != null){
      $scope.newComment.author = $scope.loggedInUser.name
    }

    addPictureComment($scope.picture._id, $scope.newComment)
    $scope.newComment=''
    $http.get('/api/pictures/picture/' + $routeParams.id)
    .success(function(picture) {
     $scope.picture = picture[0]
     console.log(picture.title)
   });
  }
}])
