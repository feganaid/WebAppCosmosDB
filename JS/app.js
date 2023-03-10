//The URIs of the REST endpoint
IUPS = "https://prod-33.northeurope.logic.azure.com/workflows/3f681a82021e4f67804a62a54c16f765/triggers/manual/paths/invoke/rest/v1/videos?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=L-M5SgrbkIEuxREnHctua9MxznXUHGRW1TXwiHInrj8";
RAI = "https://prod-44.northeurope.logic.azure.com/workflows/2fa2c176aaee460d9900c4b5fbeeb5c7/triggers/manual/paths/invoke/rest/v1/videos?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VmmFbvXRl0m-E6rCOSh1IEBLcR7BPAYdUTJfiqty1f0";
SEARCH1 = "https://prod-07.centralus.logic.azure.com/workflows/e00cf2c4a2d94c86bd9d38590ae0b4db/triggers/manual/paths/invoke/rest/v1/videos/";
SEARCH2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=k4f0U3ZJuZv58ObWc9FQtguYfUKeeodjzjLkpzkKDyM";
ADDCOMMENT = "https://prod-02.centralus.logic.azure.com/workflows/eced7439947a464fb8b3568eb5718636/triggers/manual/paths/invoke/rest/v1/comments/?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TnRNifbEBFG-ttZoCGGFaG7nl4CRv20IR85rVTBKKZE";
GETCOMMENTS1 = "https://prod-04.centralus.logic.azure.com/workflows/75e49a5c613e423eb9246f9fc54dae23/triggers/manual/paths/invoke/rest/v1/comments/";
GETCOMMENTS2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wkYKJE4ITc4I7F56hYMlnRWBGtdsjPq78Pyh6togv2s";
BLOB_ACCOUNT = "https://blobstoragecom682af.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

  //Handler for retrieving videos button
  $("#retImages").click(function(){

      //Run the get videos list function
      getImages();

  }); 

   //Handler for uploading new video button
  $("#subNewForm").click(function(){

    //Execute the upload new video function
    submitNewAsset();
    
  }); 

  //Handler for get search results list
  $("#subNewSearch").click(function(){

    //Execute the get search function
    getSearch();
    
  });
  
  //Handler for adding new comment button
  $(document).on('click', 'button.add-comments', function(){ 


    //Execute the submit new comment function
    submitNewComment();
    
  });
  //Handler for get comments results list
  $(document).on('click', 'button.get-comments', function(){ 


    //Execute the get comments function
    getComments();
    
  });
});

//A function to upload a new video to the REST endpoint 
function submitNewAsset(){
  
//Create a form data object
submitData = new FormData();

//Get form variables and append them to the form data object
submitData.append('Title', $('#Title').val());
submitData.append('Publisher', $('#Publisher').val());
submitData.append('Producer', $('#Producer').val());
submitData.append('Genre', $('#Genre').val());
submitData.append('Age', $('#Age').val());
submitData.append('userID', $('#userID').val());
submitData.append('userName', $('#userName').val());
submitData.append('File', $("#UpFile")[0].files[0]);

//Post the form data to the endpoint, note the need to set the content type header
$.ajax({
  url: IUPS,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){

  }
});
}


//A function to submit a new comment to the REST endpoint 
function submitNewComment(){
  
//Create a form data object
submitData = new FormData();

//Get form variables and append them to the form data object
submitData.append('userName', $('input[name="userName"]').val());
submitData.append('Comment', $('input[name="comment"]').val());
submitData.append('Rating', $('input[name="rating"]').val());
submitData.append('videoID', $('input[name="videoid"]').val());
 
//Post the form data to the endpoint, note the need to set the content type header
$.ajax({
  url: ADDCOMMENT,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){

  }
});
}

//A function to get a list of all the video and write them and a comment/rate form to the Div with the ImageList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>'); 
 
  $.getJSON(RAI, function( data ) {
  
  //Create an array to hold all the retrieved video records
  var items = [];
   
  //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
  $.each( data, function( key, val ) {
  items.push( "<hr />");
  items.push("<video src='"+BLOB_ACCOUNT + val["filePath"] +"' type='video/mp4' width='640' height='360' controls> </video> <br />");
  items.push( "Title : " + val["Title"] + "<br />");
  items.push( "Publisher : " + val["Publisher"] + "<br />");
  items.push( "Producer : " + val["Producer"] + "<br />");
  items.push( "Genre : " + val["Genre"] + "<br />");
  items.push( "Age : " + val["Age"] + "<br />");
  items.push( "Uploaded by: " + val["userName"] + "<br />");
  items.push( "<hr />");
  items.push( "Comment/Rate" + "<br />");
  items.push("<form style='font-size: 10pt;' id = 'comment" + val["id"] +"' class = 'add-comment'>");
  items.push("<div class='mb-3'>");
  items.push("<label for='userName' class='form-label'>User Name</label>");
  items.push("<input type='text' class='form-control' name='userName'></br>");
  items.push("<label for='rating' class='form-label'>Rating</label>");
  items.push("<input type='number' class='form-control' min='1' max='5' name='rating'></br>");
  items.push("<label for='comment' class='form-label'>Comment</label>");
  items.push("<input type='text' class='form-control' name='comment'></br>");
  items.push("<input type='hidden' class='form-control' value='" + val["id"] + "' name='videoid'>");
  items.push("<button type='button' class='add-comments'>Submit</button>");
  items.push("<button type='button' id='" +val["id"] +"' class='get-comments'>View Comments</button></br>");
  items.push("</div>");
  items.push("</form>");
  items.push("</div>");
  items.push("<div id='" + val["id"] + "'></div>") 
  items.push("</div>");
  });
  
    //Clear the ImageList div 
    $('#ImageList').empty();
    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
    }).appendTo( "#ImageList" );
   });
}


//A function to get a list of all the videos with a given search criteria and write them to the Div with the SearchResults Div
function getSearch(){

  //Replace the current HTML in that div with a loading message
  $('#SearchResults').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>'); 
 
  var search = $('#search').val()
 
  $.getJSON(SEARCH1 + search + SEARCH2, function( data ) {
  
  //Create an array to hold all the retrieved assets
  var items = [];
   
  //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
  $.each( data, function( key, val ) {
  items.push( "<hr />");
  items.push("<video src='"+BLOB_ACCOUNT + val["filePath"] +"' type='video/mp4' width='640' height='360' controls> </video> <br />");
  items.push( "Title : " + val["Title"] + "<br />");
  items.push( "Publisher : " + val["Publisher"] + "<br />");
  items.push( "Producer : " + val["Producer"] + "<br />");
  items.push( "Genre : " + val["Genre"] + "<br />");
  items.push( "Age : " + val["Age"] + "<br />");
  items.push( "Uploaded by: " + val["userName"] + "<br />");
  items.push( "<hr />");
  items.push( "Comment/Rate" + "<br />");
  items.push("<form style='font-size: 10pt;' id = 'comment" + val["id"] +"' class = 'add-comment'>");
  items.push("<div class='mb-3'>");
  items.push("<label for='userName' class='form-label'>User Name</label>");
  items.push("<input type='text' class='form-control' name='userName'></br>");
  items.push("<label for='rating' class='form-label'>Rating</label>");
  items.push("<input type='number' class='form-control' min='1' max='5' name='rating'></br>");
  items.push("<label for='comment' class='form-label'>Comment</label>");
  items.push("<input type='text' class='form-control' name='comment'></br>");
  items.push("<input type='hidden' class='form-control' value='" + val["id"] + "' name='videoid'>");
  items.push("<button type='button' class='add-comments'>Submit</button>");
  items.push("<button type='button' id='" +val["id"] +"' class='get-comments'>View Comments</button></br>");
  items.push("</div>");
  items.push("</form>");
  items.push("</div>");
  items.push("Comments</br>");
  items.push("<div id='" + val["id"] + "'></div>") 
  items.push("</div>");
  });
  
    //Clear the SearchResults div 
    $('#SearchResults').empty();
    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
    }).appendTo( "#SearchResults" );
   });
}


//A function to get a list of all the comments associated to the specific video ID and write them to the Div with the videoIDcomments Div
function getComments() {
   
  var VID = $('input[name="videoid"]').val() 
 
  GETCOMMENTS = GETCOMMENTS1 + VID + GETCOMMENTS2; 
  
  $('#' + VID).html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
 
  $.getJSON(GETCOMMENTS, function( data ) { 
  
  var comments = [];  
   
  $.each( data, function( key, val ) { 
  comments.push( "UserName : " + val["userName"] + ", Rating : " + val["Rating"] + " out of 5 , Comment : " + val["Comment"] + "<br />"); 
  });
  
  //Clear the assetlist div 
    $('#' + VID).empty() 
    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
    "class": "my-new-list",
    html: comments.join( "" )
    }).appendTo( '#' + VID );
   });
} 
  
