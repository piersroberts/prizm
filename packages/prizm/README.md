# @prizm/prizmjs

## Installation

```bash
npm install @prizm/prizmjs
```

## Usage

```javascript
import { Screen, Palette } from "@prizmjs/prizm";

function loop(f: number) {
    screen.gfx.drawLine(
        [170, 88],
        [
        170 + Math.cos((f / 1000) * Math.PI * 2) * 20,
        88 + Math.sin((f / 1000) * Math.PI * 2) * 20,
        ],
    );
    screen.render();
    requestAnimationFrame(loop);
}

loop(0);
```
