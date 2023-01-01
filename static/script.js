var xStart1;
var yStart1;
var xEnd1;
var yEnd1;

var xStart2;
var yStart2;
var xEnd2;
var yEnd2;

var image;

var cropper1;
var cropper2;



// var id = 1;

function condition(id){
  
if (id == 1){

 photo1 = document.getElementById('magPhoto_1');
 photo2 = document.getElementById('phasePhoto_2');


 console.log("id 1111111")

}
else if (id == 2){
 photo1 = document.getElementById('phasePhoto_1');
 photo2 = document.getElementById('magPhoto_2');
 console.log("id 22222222")
}
}



function crop1(){
  cropper1 = new Cropper(photo1, {
  autoCropArea: 1,
  crop(event) {
      xStart1 = event.detail.x;
      yStart1 = event.detail.y;
      xEnd1 = event.detail.x + event.detail.width;
      yEnd1 = event.detail.y + event.detail.height;
  },
  });
}

function crop2(){

  cropper2 = new Cropper(photo2, {
  autoCropArea: 1,
  crop(event) {
      xStart2 = event.detail.x;
      yStart2 = event.detail.y;
      xEnd2 = event.detail.x + event.detail.width;
      yEnd2 = event.detail.y + event.detail.height;
  },
  });
}



condition(1)
window.addEventListener("click", crop1)
window.addEventListener("click", crop2)
window.addEventListener("click", sendVariables)
window.addEventListener("click", sendVariables2)


function sendVariables(e){
console.log('aaaaa', xStart1)
console.log('bbbbb', xEnd1)

var canvas1_points = { 
  x1  : xStart1,
  y1 :  yStart1,
  x2 : xEnd1,
  y2: yEnd1 }
   fetch(`${window.origin}/canvas1`, {
     method: "POST",
     credentials: "include",
     body: JSON.stringify(canvas1_points),
     cache: "no-cache",
     headers: new Headers({
       "content-type": "application/json"
    })
    })
  }

function sendVariables2(e){
  console.log('aaaaa', xStart2)
  console.log('bbbbb', xEnd2)
  
  var canvas2_points = { 
    x1  : xStart2,
    y1 :  yStart2,
    x2 : xEnd2,
    y2: yEnd2 }
      fetch(`${window.origin}/canvas2`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(canvas2_points),
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json"
      })
      })
    }


  $(document).ready(function(){
    const mag1 = document.getElementById("magPhoto_1")
    const phase2 = document.getElementById("phasePhoto_2")
    const out2 = document.getElementById("out2")
    mag1.src="/static/imgs/mag1.png"
    phase2.src="/static/imgs/phase2.png"
    out2.src ="/static/imgs/imageOut2.png"
    mag1.style.display="inline"
    phase2.style.display="inline"
    out2.style.display="inline"

  })
  

function change(radio){
    const mag1 = document.getElementById("magPhoto_1")
    const mag2 = document.getElementById("magPhoto_2")
    const phase1 = document.getElementById("phasePhoto_1")
    const phase2 = document.getElementById("phasePhoto_2")
    const out1 = document.getElementById("out1")
    const out2 = document.getElementById("out2")
    var d = new Date();
    const selectedValue = radio.value;


    if (selectedValue == "Magnitude" )
    {
      
      cropper1.disable()
      cropper2.disable()
      condition(1)

      // cropper1.replace('static/imgs/mag1.png')
      // cropper2.replace('static/imgs/phase2.png')

      mag1.src = "/static/imgs/mag1.png?"+d.getMilliseconds()
      phase2.src = "/static/imgs/phase2.png?"+d.getMilliseconds()
      mag1.style.display = "inline";
      phase2.style.display = "inline"
      mag2.style.display = "none"
      phase1.style.display = "none"
      out2.style.display="inline"
      out1.style.display="none"

    }
    else if (selectedValue == "Phase" ) 
    {
      cropper1.destroy()
      cropper2.destroy()
      // cropper1.replace('static/imgs/phase1.png')
      // cropper2.replace('static/imgs/mag2.png')
  
      condition(2)
      mag2.src = "/static/imgs/mag2.png?"+d.getMilliseconds()
      phase1.src = "/static/imgs/phase1.png?"+d.getMilliseconds()
      mag2.style.display = "inline";
      phase1.style.display = "inline"
      mag1.style.display = "none";
      phase2.style.display = "none"
      out1.style.display="inline"
      out2.style.display="none"
    }

  }



$(document).on('change','#upload-button',function(){
        var property = document.getElementById("upload-button").files[0];
        var phasePhoto_1 =document.getElementById("phasePhoto_1")
        var magPhoto_1 =document.getElementById("magPhoto_1")
        var form_data = new FormData();
        form_data.append("file",property);
        $.ajax({
            url:"/upload",
            method:"POST",
            data:form_data,
            contentType:false,
            cache:false,
            processData:false,
            dataType: 'json',
            success:function(data){
            var d = new Date();
                $('#img1').attr('src', '/static/'+data['path'])
                if(document.getElementById('radio1').checked ){
                  // $('#magPhoto_1').attr('src','/static/'+'imgs/mag1.png?'+d.getMilliseconds())
                  // $('#magPhoto_1').visible()
                  magPhoto_1.src="/static/imgs/mag1.png?"+d.getMilliseconds()
                  magPhoto_1.style.display="inline"
                  
                }
                else if(document.getElementById('radio2').checked ){
                  // $('#phasePhoto_1').attr('src','/static/'+'imgs/phase1.png?'+d.getMilliseconds())
                  // $('#phasePhoto_1').visible()
                  phasePhoto_1.src="/static/imgs/mag1.png?"+d.getMilliseconds()
                  phasePhoto_1.style.display="inline"
                } 
                // $('#magPhoto_1').attr('src','/static/'+'imgs/mag1.png')
                // $('#phasePhoto_1').attr('src','/static/'+'imgs/phase1.png')
                var out1 = document.getElementById('out1');
  var out2 = document.getElementById('out2');
  $.ajax({
    url:"/outputUpdate",
    type: "POST",
    contentType:false,
    cache:false,
    processData:false,
    dataType: 'json',
    success:function(data){
      var d = new Date();
      console.log(100)
        if(document.getElementById('radio1').checked){
          // condition()
          // $('#out1').attr('src','/static/imgs/imageOut1.png?'+d.getMilliseconds())
          // $('#out1').show()
          out2.src="/static/imgs/imageOut2.png?"+d.getMilliseconds()
          out2.style.display="inline"
          out1.src="/static/imgs/imageOut1.png?"+d.getMilliseconds()
        }
        else if(document.getElementById('radio2').checked){
          // condition()
          out1.src="/static/imgs/imageOut1.png?"+d.getMilliseconds()
          out1.style.display="inline"
          out2.src="/static/imgs/imageOut2.png?"+d.getMilliseconds()

        }


  }});
            }
        })
  })


  $(document).on('change','#upload-button2',function(){
    var property = document.getElementById("upload-button2").files[0];
    var phasePhoto_2 =document.getElementById("phasePhoto_2")
    var magPhoto_2 =document.getElementById("magPhoto_2")
    var form_data = new FormData();
    form_data.append("file",property);
    $.ajax({
        url:"/upload2",
        method:"POST",
        data:form_data,
        contentType:false,
        cache:false,
        processData:false,
        dataType: 'json',
        success:function(data){
          var d = new Date();
            $('#img2').attr('src', '/static/'+data['path'])
            if(document.getElementById('radio1').checked){
              // $('#phasePhoto_2').attr('src','/static/'+'imgs/phase2.png?'+d.getMilliseconds())
              phasePhoto_2.src ="/static/imgs/phase2.png?"+d.getMilliseconds()
              phasePhoto_2.style.display="inline"
            }
            else if(document.getElementById('radio2').checked){
              // $('#magPhoto_1').attr('src','/static/'+'imgs/mag1.png?'+d.getMilliseconds())
              magPhoto_2.src ="/static/imgs/mag2.png?"+d.getMilliseconds()
              magPhoto_2.style.display="inline"


            }
            var out1 = document.getElementById('out1');
  var out2 = document.getElementById('out2');
  var ajax2= $.ajax({
    url:"/outputUpdate",
    type: "POST",
    contentType:false,
    cache:false,
    processData:false,
    dataType: 'json',
    success:function(data){
      var d = new Date();
      console.log(100)
        if(document.getElementById('radio1').checked ){
          // $('#out1').attr('src','/static/imgs/imageOut1.png?'+d.getMilliseconds())
          // $('#out1').show()
          out2.src="/static/imgs/imageOut2.png?"+d.getMilliseconds()
          out2.style.display="inline"
          out1.src="/static/imgs/imageOut1.png?"+d.getMilliseconds()
        }
        else if(document.getElementById('radio2').checked){
          out1.src="/static/imgs/imageOut1.png?"+d.getMilliseconds()
          out1.style.display="inline"
          out2.src="/static/imgs/imageOut2.png?"+d.getMilliseconds()

        }


  }});

    }
    })
  })


function load(){
  var input_img = document.getElementsByName('pic1');
  var img1 = document.getElementsByName('default1')
  input_img[0].style.display = 'inline';
  img1[0].style.display = 'none';
}

function load2(){
  var input_img2 = document.getElementsByName('pic2');
  var img2 = document.getElementsByName('default2')
  input_img2[0].style.display = 'inline';
  img2[0].style.display = 'none';

}
