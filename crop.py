import os
import random
import string
from PIL import Image

# Функция для генерации случайного имени
def generate_random_name():
    name_length = random.randint(3, 5)
    return ''.join(random.choices(string.ascii_letters + string.digits, k=name_length))

# Функция для кропа изображения до квадрата
def crop_to_square(image):
    width, height = image.size
    # Определяем минимальный размер, чтобы сделать квадрат
    min_dimension = min(width, height)
    # Центрируем кроп для получения квадрата
    left = (width - min_dimension) // 2
    top = (height - min_dimension) // 2
    right = (width + min_dimension) // 2
    bottom = (height + min_dimension) // 2
    return image.crop((left, top, right, bottom))

# Основная функция для обработки изображений
def process_images(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    for filename in os.listdir(input_folder):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            # Открываем изображение
            img_path = os.path.join(input_folder, filename)
            img = Image.open(img_path)
            
            # Обрезаем изображение до квадрата
            img_cropped = crop_to_square(img)
            
            # Генерируем случайное имя для изображения
            new_name = generate_random_name() + ".png"
            output_path = os.path.join(output_folder, new_name)
            
            # Сохраняем обработанное изображение
            img_cropped.save(output_path)
            print(f"Saved: {output_path}")

input_folder = 'C:/Users/ch1ka/Pictures/input'  # Папка с оригинальными изображениями
output_folder = 'C:/Users/ch1ka/Pictures/output'  # Папка для сохранения кропнутых изображений
process_images(input_folder, output_folder)
