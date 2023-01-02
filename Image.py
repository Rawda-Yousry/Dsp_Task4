import cv2
import numpy as np
from matplotlib import pyplot as plt


class Image:
    def __init__(self, path, canvas_points):
        self.path = path
        # self.img = self.read()
        self.xStart = canvas_points[0]
        self.yStart = canvas_points[1]
        self.xEnd = canvas_points [2]
        self.yEnd = canvas_points [3]

    def read(self):
        self.img = cv2.imread(self.path, 0)

    def getFreq(self):
        freq = np.fft.fft2(self.img)
        self.fshift = np.fft.fftshift(freq)

    def magSpectrum(self):
        self.magnitude_spectrum = 20*np.log(np.abs(self.fshift))

    def phaseSpectrum(self):
        self.phase_spectrum = np.angle(self.fshift)

    def fourierTransform(self, n, m):
        f = np.fft.fft2(self.img, (n, m))
        self.fshift = np.fft.fftshift(f)
        self.mag = np.abs(self.fshift)
        self.phase = np.angle(self.fshift)

    def crop(self, array):
        arrayShape = np.shape(array)
        values = np.zeros(arrayShape, dtype = 'uint8')
        values = cv2.rectangle(values,(self.xStart, self.yStart), (self.xEnd, self.yEnd), (1,1,1), -1)
        returned_array = np.multiply(array, values)
        # if flag == True:
        #     returned_array = array - returned_array
        return returned_array

    def resize(self):
        self.newMag = self.crop(self.mag)
        self.newPhase = self.crop(self.phase)

    def save(self, data, save_path):
        plt.figure()
        plt.imshow(data, cmap='gray')
        plt.axis('off')
        plt.savefig(save_path, bbox_inches='tight', pad_inches=0)

        
class ImageProcessing(Image):
    def __init__(self, path, canvas_points, mag, phase):
        super().__init__(path, canvas_points)
        self.mag = mag
        self.phase = phase

    def mixImages(self):
        combined = self.mag * np.exp(1j*self.phase)
        self.imgCombined = np.abs(np.fft.ifft2(combined))
