from OpenGL.GL import *
from OpenGL.GLUT import *
from OpenGL.GLU import *

def draw():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)  # Clear the screen
    glColor3f(1.0, 0.0, 0.0)  # Red color
    glBegin(GL_TRIANGLES)  # Draw a triangle
    glVertex2f(-0.5, -0.5)
    glVertex2f(0.5, -0.5)
    glVertex2f(0.0, 0.5)
    glEnd()
    glFlush()  # Ensure all commands are executed

def main():
    glutInit()  # Initialize GLUT
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)  # Single buffer and RGB mode
    glutInitWindowSize(500, 500)  # Window size
    glutCreateWindow(b"OpenGL Window")  # Create window
    glutDisplayFunc(draw)  # Register the draw function
    glutMainLoop()  # Start the GLUT main loop

if __name__ == "__main__":
    main()
