import pygame
import sys

# Function for Bresenham's line drawing
def bresenhamLine(x1, y1, x2, y2):
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx - dy

    while True:
        pygame.draw.rect(screen, (255, 255, 255), (x1, y1, 1, 1))  # Draw pixel
        if x1 == x2 and y1 == y2:
            break
        e2 = err * 2
        if e2 > -dy:
            err -= dy
            x1 += sx
        if e2 < dx:
            err += dx
            y1 += sy

# Initialize Pygame
pygame.init()
screen = pygame.display.set_mode((500, 500))
pygame.display.set_caption("Bresenham's Line Algorithm")

# Draw a line
bresenhamLine(100, 100, 400, 300)

# Display the result
pygame.display.flip()

# Wait for window close
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
sys.exit()
