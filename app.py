from Image import Image
from Image import ImageProcessing
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

app.secret_key = 'secret key'
UPLOAD_FOLDER = 'static//images//'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["SESSION_PERMANENT"] = False
file_path1 = 'images\\img1.png'
file_path2 = 'images\\img2.png'


canvas1_points = [0, 0, 1, 1]
canvas2_points = [0, 0, 1, 1]
inverse_Flag = False


@app.route("/")
def index():
    return render_template("index.html")
    

def upload(file):
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    file_path = '/'.join(['images', filename])
    return filename, file_path

def magPhaseshow(file_path, points, mag_save_path, phase_save_path):
    img = Image('static\\' + file_path, points)
    img.read()
    img.getFreq()
    img.magSpectrum()
    img.phaseSpectrum()  
    img.save(img.magnitude_spectrum, mag_save_path)
    img.save(255*(img.phase_spectrum), phase_save_path)
    print('magspec', img.magnitude_spectrum.shape)
    print('phasespec', img.phase_spectrum.shape)


@app.route("/upload/<int:image_id>",methods=["POST"])
def uploadImage(image_id):
    file = request.files['file']
    canvas1_points = [0, 0, 1, 1]
    canvas2_points = [0, 0, 1, 1]
    if file:
        if image_id == 1:
            global file_path1
            filename, file_path1 = upload(file)
            magPhaseshow(file_path1, canvas1_points, 'static/imgs/mag1.png', 'static/imgs/phase1.png')
        else:
            global file_path2
            filename, file_path2 = upload(file)
            magPhaseshow(file_path2, canvas2_points, 'static/imgs/mag2.png', 'static/imgs/phase2.png')
    return jsonify(name=filename)



@app.route('/outputUpdate', methods = ["POST"])
def update():
    if request.method == "POST":
        print(file_path1)
        img1 = Image('static\\' + file_path1, canvas1_points)
        img2 = Image('static\\'+ file_path2, canvas2_points)

        img1.read()
        img2.read()

        m = max(len(img1.img), len(img2.img))
        n = max(len(img1.img[0]), len(img2.img[0]))

        img1.fourierTransform(n, m)
        img2.fourierTransform(n, m)

        img1.resize(inverse_Flag)
        img2.resize(inverse_Flag)

        newImg1 = ImageProcessing('static/' + file_path1, canvas1_points, img2.newMag, img1.newPhase)
        newImg2 = ImageProcessing('static/'+ file_path2, canvas2_points, img1.newMag, img2.newPhase)

        newImg1.mixImages()
        newImg2.mixImages()

        newImg1.save(newImg1.imgCombined, 'static\imgs\imageOut1.png')
        newImg2.save(newImg2.imgCombined, 'static\imgs\imageOut2.png')
        
        print('mag', img1.mag)
        print('phase', img1.phase)
        print('new mag', img1.newMag)
        print('new phase', img1.newPhase)
        return" "


@app.route("/canvas1", methods = ["post"])
def canvas1():
    data = request.get_json()
    xStart1 = data["x1"]
    yStart1= data["y1"]
    xEnd1 = data["x2"]
    yEnd1 = data["y2"]
    global canvas1_points
    canvas1_points = [round(xStart1),round(yStart1),round(xEnd1),round(yEnd1)]
    update()
    return "  "


@app.route("/canvas2", methods = ["POST"])
def canvas2():
    data2 = request.get_json()
    xStart2 = data2["x1"]
    yStart2= data2["y1"]
    xEnd2 = data2["x2"]
    yEnd2 = data2["y2"]
    global canvas2_points
    canvas2_points = [round(xStart2),round(yStart2),round(xEnd2),round(yEnd2)]
    return "  "

@app.route('/normal', methods=['POST'])
def normal():
    global inverse_Flag
    id = request.get_json()
    inverse_Flag = id["x1"]
    update()
    return"  "



if __name__ == '__main__':
    app.run(debug=True)









