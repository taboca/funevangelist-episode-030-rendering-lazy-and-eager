# Episode 030 – The Lazy and Eager Grid Renderer 

An educational experiment on how browsers handle **lazy vs. eager image loading**, using a simulated slow server and **Puppeteer screenshots**.

Modern browsers optimize network performance by deferring image loads until the moment they enter the viewport. Developers rely on this for faster first paints and lighter page loads.

When rendering sites (e.g. with Puppeteer for screenshots or marketing previews), those lazy images may not load in time for the screenshot. The result is broken thumbnails or incomplete renders.

How can we **simulate** this difference reproducibly—showing both the **problem** and the **fix**—without depending on remote servers or large image sets? We build a **tiny Node.js server** that streams PNGs slowly and renders two HTML pages:

* `/grid/lazy` → uses `loading="lazy"`
* `/grid/eager` → uses `loading="eager" fetchpriority="high"`

A **renderer script** captures both cases via Puppeteer, showing how lazy loading breaks rendering under automation while eager loading completes.

## 🧱 Project Structure

```
episode_030_grid_lazy_render
├── images/
│   ├── img-01.png … img-25.png      
├── eager.html                         ← eager-HTML with the loading="eager" 
├── lazy.html                          ← lazy-HTML with the loading="lazy" 
├── grid.mjs                           ← slow streaming grid server
├── render.mjs                         ← Puppeteer renderer
└── eager.png / lazy.png               ← rendered results
```

## 🖼️ Rendered Comparison

| Lazy (some images never loaded) | Eager (all loaded)           |
| ------------------------------- | ---------------------------- |
| ![lazy sample](./lazy.png)      | ![eager sample](./eager.png) |


## ⚙️ Prerequisites

* **Node.js 20+**
* **Puppeteer** (installed automatically via `npm install`)
* Optional GUI requirement:
  If you run with `headless: false`, Puppeteer needs a display.
  On Linux / WSL2, set:

  ```bash
  export DISPLAY=:0
  ```

## 🚀 Quick Start

```bash
npm install
node grid.mjs
# → serves:
#   http://localhost:3000/grid/lazy
#   http://localhost:3000/grid/eager
node render.mjs
```

Each image request (`/slow/img-XX.png`) streams in **random 1–15 s**, simulating unstable networks.
Compare `lazy.png` vs `eager.png` to observe how Puppeteer waits—or doesn’t—for images.


## 💡 Educational Goal

This experiment helps authors, educators, and engineers **see** why some automated renderers produce blank thumbnails, and how **loading strategy** impacts perceived completeness.

---

MIT License
Copyright (c) 2025 Marcio S. Galli

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

Marcio’s Additional Terms

LIFE LIFE LIFE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. THE FOLLOWING TERMS AND CONDITIONS GOVERN YOUR USE OF THIS SERVICE AND ANY OTHER RELATED MATERIAL. IF YOU DO NOT AGREE TO THE TERMS AND CONDITIONS PROVIDED HERE, DO NOT USE THE SERVICE.

UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, ANY CIRCUMSTANCE, SHALL THIS SERVICE, ITS CREATOR AND/OR PARENT ENTITIES OR AFFILIATES BE LIABLE FOR ANY DIRECT OR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES FROM THE DIRECT OR INDIRECT USE OF, OR THE INABILITY TO USE.

THIS SERVICE SHOULD NOT BE USED FOR MISSION CRITICAL APPLICATIONS, SUCH AS AIRCRAFT CONTROL, RADAR MONITORING, GLOBAL TERMONUCLEAR WAR CONTROL. LIFE, THOUGHT, CONTENT, OR ANY OTHER RELATED MATERIAL, IS SUBJECT TO FAILURE OR CHANGES WITHOUT PRIOR NOTICE. THIS AGREEMENT IS EFFECTIVE TIL TERMINATED BY THE SERVICE CREATOR, AT ANY TIME WITHOUT NOTICE. IN THE EVENT OF FINAL TERMINATION, YOU ARE NO LONGER AUTHORIZED TO LIVE IN, ENJOY, CREATE, MODIFY, AND EVOLVE. USE THIS AT YOUR OWN RISK AND, JUST ENJOY.

Say thanks if this helped you 💛, the bitcoin address:

`bc1qd7y7d2875ujj5uzm2eufe5zjj42ps0ye6g9cq5`

![](EXTRA_donation.png)
