/* Copyright 2019 Google LLC All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ==============================================================================*/

import { visualize } from "./visualize";
import { UMAP } from "umap-js";
import { Point } from "./generators";

export const N_EPOCHS = 400;

const timescale = d3
  .scaleLinear()
  .domain([0, 20, 50, 100, 200, 6000])
  .range([60, 30, 20, 10, 0]);

export function runDemo(points, canvas, options, stepCb) {
  const demo = {};
  let paused = false;
  let step = 0;
  let chunk = 5;
  let frameId;

  // const tsne = new tsnejs.tSNE(options);
  const data = points.map(point => point.coords);
  const umap = new UMAP({
    nEpochs: N_EPOCHS,
    ...options
  });
  umap.initializeFit(data);

  // const dists = distanceMatrix(points);
  // tsne.initDataDist(dists);

  function iterate() {
    if (paused) return;

    // control speed at which we iterate
    // if (step = 200) chunk = 10;
    for (let k = 0; k < chunk; k++) {
      umap.step();
      ++step;
    }

    //inform the caller about the current step
    stepCb(step);

    // update the solution and render
    // const solution = tsne.getSolution().map(function(coords, i) {
    //   return new Point(coords, points[i].color);
    // });
    const solution = umap.getEmbedding().map((coords, i) => {
      return new Point(coords, points[i].color);
    });
    visualize(solution, canvas, ""); //removed message

    //control the loop.
    const timeout = timescale(step);
    setTimeout(function() {
      frameId = window.requestAnimationFrame(iterate);
    }, timeout);
  }

  demo.pause = function() {
    if (paused) return; // already paused
    paused = true;
    window.cancelAnimationFrame(frameId);
  };
  demo.unpause = function() {
    if (!paused) return; // already unpaused
    paused = false;
    iterate();
  };
  demo.paused = function() {
    return paused;
  };
  demo.destroy = function() {
    demo.pause();
  };
  iterate();
  return demo;
}
