from flask import Flask, render_template, request, redirect, url_for
import functions 
from flask_uploads import UploadSet,IMAGES,configure_uploads
from flask_wtf.file import FileField,FileRequired,FileAllowed
from flask_wtf import FlaskForm
from wtforms import SubmitField
from werkzeug.utils import secure_filename
import os




app = Flask(__name__)

app.secret_key = 'secret key'

UPLOAD_FOLDER = 'static/images/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload_image', methods=['GET', 'POST'])
def upload_image():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    img1 = functions.loadImg('static/images/'+filename)
    img2 = functions.loadImg('static/images/'+filename)

    m = max(len(img1), len(img2))
    n = max(len(img1[0]), len(img2[0]))

    mag1, phase1, fshift1 = functions.fourierTransform(img1, n, m)
    mag2, phase2, fshift2 = functions.fourierTransform(img2, n, m)

    magnitude_spectrum1 = functions.magSpectrum(fshift1)
    magnitude_spectrum2 = functions.magSpectrum(fshift2)

    phase_spectrum1 = functions.phaseSpectrum(fshift2)
    phase_spectrum2 = functions.phaseSpectrum(fshift1)
    return render_template('index.html',filename=filename)
    

@app.route('/display/<filename>')
def display_image(filename):
    #print('display_image filename: ' + filename)
    return redirect(url_for( 'static' ,filename='images/' + filename))


@app.route("/")
def index():
    return render_template("index.html")

@app.route('/processing', methods=["POST"])
def processing():
    img1 = functions.loadImg('img/img1.png')
    img2 = functions.loadImg('img/img2.png')

    m = max(len(img1), len(img2))
    n = max(len(img1[0]), len(img2[0]))

    mag1, phase1, fshift1 = functions.fourierTransform(img1, n, m)
    mag2, phase2, fshift2 = functions.fourierTransform(img2, n, m)

    magnitude_spectrum1 = functions.magSpectrum(fshift1)
    magnitude_spectrum2 = functions.magSpectrum(fshift2)

    phase_spectrum1 = functions.phaseSpectrum(fshift2)
    phase_spectrum2 = functions.phaseSpectrum(fshift1)

    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
