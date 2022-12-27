import cv2
from flask import Flask,render_template,url_for
import numpy as np
from matplotlib import pyplot as plt



def loadImg(path):
    img = cv2.imread(path,0)
    return img

def writeImg(inv_img, path):
    cv2.imwrite(path, inv_img)

def fourierTransform(data, n, m):
    f = np.fft.fft2(data, (n, m))
    fshift = np.fft.fftshift(f)
    mag = np.abs(fshift)
    phase = np.angle(fshift)
    return mag, phase, fshift

def inverseFourier(phase, mag):
    combined = mag * np.exp(1j*phase)
    imgCombined = np.fft.ifft2(combined)
    return np.abs(imgCombined)

def magSpectrum(f):
    magnitude_spectrum = 20*np.log(np.abs(f))
    return magnitude_spectrum

def phaseSpectrum(f):
    phase_spectrum = np.angle(f)
    return phase_spectrum

def output(img, path):
    plt.figure()
    plt.imshow(img, cmap='gray')
    plt.savefig(path)
    # plt.show()
    