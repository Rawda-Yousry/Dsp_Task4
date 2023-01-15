// Dummy Variable To Prevent Taking Images From Cache
var dummy = new Date() 

// Starting And Ending Point For Cropped Image 1
points1 = [0,0,1,1]

// Starting And Ending Point For Cropped Image 1
points2=[0,0,1,1]

// Objects Will Be Created To Start Using Cropper
var cropper1;
var cropper2;

// Images That Are To Be Processed
var photo1 = document.getElementById("Photo_1");
var photo2 = document.getElementById("Photo_2");

// Output Of Processed Images
var out = document.getElementById('out');


// Radio Buttons For Toggling Between Magnitude And Phase Image
var magnitudeCheck = document.getElementById("radio1")
var phaseCheck = document.getElementById("radio2")



// To Specify Which Photos To Update When Image 1 Uploaded
function displayImgUpdate_1(){
  const random = new Date()
  if(magnitudeCheck.checked){
    photo1.src='static/imgs/mag1.png?'+random.getMilliseconds()
    outputDisplay();
  }
  else if(phaseCheck.checked){
    photo1.src='static/imgs/phase1.png?'+random.getMilliseconds()
    outputDisplay();
  }
}


// To Specify Which Photos To Update When Image 2 Uploaded
function displayImgUpdate_2(){
  const random = new Date()
  if(magnitudeCheck.checked){
    photo2.src='static/imgs/phase2.png?'+random.getMilliseconds()
    outputDisplay();
  }
  else if(phaseCheck.checked){
    photo2.src='static/imgs/mag2.png?'+random.getMilliseconds()
    outputDisplay();
  }

}


// For Updating Output After Any Change
function outputDisplay(){
  const random = new Date()
    $.ajax({
      url:"/outputUpdate",
      type: "POST",
      contentType:false,
      cache:false,
      processData:false,
      success:function(){
          if(magnitudeCheck.checked){
            out.src="/static/imgs/imageOut2.png?"+random.getMilliseconds()
          }
          else if(phaseCheck.checked){
            out.src="/static/imgs/imageOut1.png?"+random.getMilliseconds()
          }
    }
  });
}


// Will Run Once The Page DOM Is Ready To Execute JavaScript Code 
$(document).ready(function(){
  photo1.src="/static/imgs/mag1.png"
  photo2.src="/static/imgs/phase2.png"
  out.src ="/static/imgs/imageOut2.png"
  photo1.style.display="inline"
  photo2.style.display="inline"
  out.style.display="inline"
  cropperCondition(1) // To Specify Which Images Will Be Processed
})
  


//To Toggle Between Phase And Magnitude Radio Buttons
function change(radio){
  const selectedValue = radio.value;
  if (selectedValue == "Magnitude" ){
    cropperCondition(1)
    cropper1.destroy()
    cropper2.destroy()
    photo1.src = "/static/imgs/mag1.png?"+dummy.getMilliseconds()
    photo2.src = "/static/imgs/phase2.png?"+dummy.getMilliseconds()
    cropper1.url=photo1.src
    cropper2.url = photo2.src
    out.style.display="inline"
  } else if (selectedValue == "Phase" ){
      cropperCondition(2)
      if (cropper1){
        cropper1.destroy()
      }
      if (cropper2){
        cropper2.destroy()
      }
      photo2.src = "/static/imgs/mag2.png?"+dummy.getMilliseconds()
      photo1.src = "/static/imgs/phase1.png?"+dummy.getMilliseconds()
      if (cropper1){
        cropper1.url=photo1.src
      }
      if (cropper2){
        cropper2.url = photo2.src
      }
      out.style.display="inline"
    }
}

// For Uploading New Images 
function uploadImage(imageSelector){
  var upload = new FormData($(`#upload_form${imageSelector}`)[0])
  points1=[0,0,1,1]
  points2=[0,0,1,1]
  if (cropper1){
    cropper1.destroy()
  }
  if (cropper2){
    cropper2.destroy()
  }
  $.ajax({
      url:`/upload/${imageSelector}`,
      data:upload,
      processData:false,
      cache:false,
      contentType:false,
      type:'POST',
      success:function(data){
        if(imageSelector == 1){
          $('#img1').attr('src', "static/images/" +data["name"])
          displayImgUpdate_1()
        } else if(imageSelector == 2){
          $('#img2').attr('src', "static/images/" +data["name"])
          displayImgUpdate_2()
        }}
      });
}


// To Specify Which Images To Be Cropped When Toggling Radio Buttons
function cropperCondition(id){
  if (id == 1){
    photo1.src="static/imgs/mag1.png?"+dummy.getMilliseconds()
    photo2.src="static/imgs/phase2.png?"+dummy.getMilliseconds()
  } else if (id == 2){
    photo1.src="static/imgs/phase1.png?"+dummy.getMilliseconds()
    photo2.src="static/imgs/mag2.png?"+dummy.getMilliseconds()
  }
}


// Crop Function For Image 1
function crop1(){
  cropper1 = new Cropper(photo1 , {
  url: photo1.src,
  autoCropArea: 1,
  zoomable: false,
  movable: false,
  crop(event) {
      points1=[ event.detail.x,
        event.detail.y,
        event.detail.x + event.detail.width,
        event.detail.y + event.detail.height ]
  },
  });
}
  

// Crop Function For Image 2
function crop2(){
    photo2 = document.getElementById('Photo_2');
    cropper2 = new Cropper(photo2, {
    autoCropArea: 1,
    zoomable: false,
    movable: false,
    crop(event) {
      points2=[ event.detail.x,
        event.detail.y,
        event.detail.x + event.detail.width,
        event.detail.y + event.detail.height ]
    },
    });
}
  

// Events For Startig Cropping And Sending Starting And Ending Points Of Cropped Image For Output Displaying
photo1.addEventListener("click", crop1)
photo2.addEventListener("click", crop2)
window.addEventListener("click", sendVariables)
window.addEventListener("click", sendVariables2)
  

// Sending Points Of Cropped Image 1 And Output Displaying
function sendVariables(e){
    var canvas1_points = { 
      x1 : points1[0],
      y1 : points1[1],
      x2 : points1[2],
      y2 : points1[3]
    }

      fetch(`${window.origin}/canvas1`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(canvas1_points),
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json"
      })
      })

    outputDisplay();

}
  


// Sending Points Of Cropped Image 1 And Output Displaying
function sendVariables2(e){
  var canvas2_points = { 
    x1 : points2[0],
    y1 : points2[1],
    x2 : points2[2],
    y2 : points2[3]
  }
  
    fetch(`${window.origin}/canvas2`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(canvas2_points),
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
    })
    })
    outputDisplay();
}



// To Toggle Between Normal And Inverse Cut 
function cutCrop(){
  check = document.getElementById('check');
  if (check.checked == true){
    id = 1
  } else{
    id = 2
  }
  var idData = {
    x1:id
  }
  fetch(`${window.origin}/normal`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(idData),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
  })
 }
)}


// To Delete Cropper In Image 
function Delete(e){
  if (e.key === "Delete"){
    alert('if you want to delete:\nCropper 1 press 1 \nCropper 2 press 2.')
    window.addEventListener("keyup", Delete_cropper_number)
    return
  }
}


// To Identify Which Cropper To Delete 
function Delete_cropper_number(e){
  if(e.key === "1"){
    cropper1.destroy()
  }
  else if (e.key === "2"){
    cropper2.destroy()
  }
}

window.addEventListener('keydown', Delete)