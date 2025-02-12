#include<stdio.h>
#include<graphics.h>

void onCirclePoint(int xc, int yc, int x, int y, int color) {
    putpixel(xc + x, yc + y, color);
    putpixel(xc - x, yc + y, color);
    putpixel(xc + x, yc - y, color);
    putpixel(xc - x, yc - y, color);
    putpixel(xc + y, yc + x, color);
    putpixel(xc - y, yc + x, color);
    putpixel(xc + y, yc - x, color);
    putpixel(xc - y, yc - x, color);
}

void bresenhamCircle(int xc, int yc, int R, int color) {
    int x = 0;
    int y = R;
    float d = 5.0/4.0 - R;
    onCirclePoint(xc, yc, x, y, color);
    while(y > x) {
        if(d < 0) {
            d += 2 * x +3;
        } else {
            d += 2 * (x - y) + 5;
            y--;
        }
        x++;
        onCirclePoint(xc, yc, x, y, color);
    }
}

int main() {

    int xc = 100, yc = 100;
    int r = 50;
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");
    bresenhamCircle(xc, yc, r, WHITE);

    getch();
    closegraph();

    return 0;
}