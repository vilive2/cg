#include <iostream>
#include <graphics.h>

void bresenhamLine(int x1, int y1, int x2, int y2) {
    int dx = abs(x2 - x1);
    int dy = abs(y2 - y1);
    int sx = (x1 < x2) ? 1 : -1;
    int sy = (y1 < y2) ? 1 : -1;
    int err = dx - dy;

    while (true) {
        putpixel(x1, y1, WHITE); // Draw pixel at (x1, y1)

        if (x1 == x2 && y1 == y2) break; // End condition
        int e2 = err * 2;

        if (e2 > -dy) { err -= dy; x1 += sx; } // Update x-coordinate
        if (e2 < dx) { err += dx; y1 += sy; } // Update y-coordinate
    }
}

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");

    int x1 = 100, y1 = 100, x2 = 400, y2 = 300;
    bresenhamLine(x1, y1, x2, y2);

    getch();
    closegraph();
    return 0;
}
