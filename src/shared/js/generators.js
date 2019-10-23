// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as d3 from "d3";
import { createCanvas } from "canvas";

// Euclidean distance.
export function dist(a, b) {
  var d = 0;
  for (var i = 0; i < a.length; i++) {
    d += (a[i] - b[i]) * (a[i] - b[i]);
  }
  return Math.sqrt(d);
}

// Gaussian generator, mean = 0, std = 1.
var normal = d3.randomNormal();

// Create random Gaussian vector.
export function normalVector(dim) {
  var p = [];
  for (var j = 0; j < dim; j++) {
    p[j] = normal();
  }
  return p;
}

// Scale the given vector.
export function scale(vector, a) {
  for (var i = 0; i < vector.length; i++) {
    vector[i] *= a;
  }
}

// Add two vectors.
export function add(a, b) {
  var n = a.length;
  var c = [];
  for (var i = 0; i < n; i++) {
    c[i] = a[i] + b[i];
  }
  return c;
}

// A point with color info.
export class Point {
  constructor(coords, color) {
    this.coords = coords;
    this.color = color || "#039";
  }
}

// Adds colors to points depending on 2D location of original.
export function addSpatialColors(points) {
  var xExtent = d3.extent(points, function(p) {
    return p.coords[0];
  });
  var yExtent = d3.extent(points, function(p) {
    return p.coords[1];
  });
  var xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([0, 255]);
  var yScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([0, 255]);
  points.forEach(function(p) {
    var c1 = ~~xScale(p.coords[0]);
    var c2 = ~~yScale(p.coords[1]);
    p.color = "rgb(20," + c1 + "," + c2 + ")";
  });
}

// Convenience function to wrap 2d arrays as Points, using a default
// color scheme.
export function makePoints(originals) {
  var points = originals.map(function(p) {
    return new Point(p);
  });
  addSpatialColors(points);
  return points;
}

// Creates distance matrix for t-SNE input.
export function distanceMatrix(points) {
  var matrix = [];
  var n = points.length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      matrix.push(dist(points[i].coords, points[j].coords));
    }
  }
  return matrix;
}

// Data in shape of 2D grid.
export function gridData(size) {
  var points = [];
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      points.push([x, y]);
    }
  }
  return makePoints(points);
}

// Gaussian cloud, symmetric, of given dimension.
export function gaussianData(n, dim) {
  var points = [];
  for (var i = 0; i < n; i++) {
    var p = normalVector(dim);
    points.push(new Point(p));
  }
  return points;
}

// Elongated Gaussian ellipsoid.
export function longGaussianData(n, dim) {
  var points = [];
  for (var i = 0; i < n; i++) {
    var p = normalVector(dim);
    for (var j = 0; j < dim; j++) {
      p[j] /= 1 + j;
    }
    points.push(new Point(p));
  }
  return points;
}

// Return a color for the given angle.
export function angleColor(t) {
  var hue = ~~((300 * t) / (2 * Math.PI));
  return "hsl(" + hue + ",50%,50%)";
}

// Data in a 2D circle, regularly spaced.
export function circleData(numPoints) {
  var points = [];
  for (var i = 0; i < numPoints; i++) {
    var t = (2 * Math.PI * i) / numPoints;
    points.push(new Point([Math.cos(t), Math.sin(t)], angleColor(t)));
  }
  return points;
}

// Random points on a 2D circle.
export function randomCircleData(numPoints) {
  var points = [];
  for (var i = 0; i < numPoints; i++) {
    var t = 2 * Math.PI * Math.random();
    points.push(new Point([Math.cos(t), Math.sin(t)], angleColor(t)));
  }
  return points;
}

// Clusters arranged in a circle.
export function randomCircleClusterData(numPoints) {
  var points = [];
  for (var i = 0; i < numPoints; i++) {
    var t = (2 * Math.PI * i) / numPoints; //Math.random();
    var color = angleColor(t);
    for (var j = 0; j < 20; j++) {
      var x = Math.cos(t) + 0.01 * normal();
      var y = Math.sin(t) + 0.01 * normal();
      points.push(new Point([x, y], color));
    }
  }
  return points;
}

// Two 2D clusters of different sizes.
export function twoDifferentClustersData2D(n) {
  var points = [];
  for (var i = 0; i < n; i++) {
    points.push(new Point([10 * normal(), 10 * normal()], "#039"));
    points.push(new Point([100 + normal(), normal()], "#f90"));
  }
  return points;
}

// Two clusters of the same size.
export function twoClustersData(n, dim) {
  dim = dim || 50;
  var points = [];
  for (var i = 0; i < n; i++) {
    points.push(new Point(normalVector(dim), "#039"));
    var v = normalVector(dim);
    v[0] += 10;
    points.push(new Point(v, "#f90"));
  }
  return points;
}

// Two differently sized clusters, of arbitrary dimensions.
export function twoDifferentClustersData(n, dim, scale) {
  dim = dim || 50;
  scale = scale || 10;
  var points = [];
  for (var i = 0; i < n; i++) {
    points.push(new Point(normalVector(dim), "#039"));
    var v = normalVector(dim);
    for (var j = 0; j < dim; j++) {
      v[j] /= scale;
    }
    v[0] += 20;
    points.push(new Point(v, "#f90"));
  }
  return points;
}

// Three clusters, at different distances from each other, in 2D
export function threeClustersData2d(n) {
  var points = [];
  for (var i = 0; i < n; i++) {
    points.push(new Point([normal(), normal()], "#039"));
    points.push(new Point([10 + normal(), normal()], "#f90"));
    points.push(new Point([50 + normal(), normal()], "#6a3"));
  }
  return points;
}

// Three clusters, at different distances from each other, in any dimension.
export function threeClustersData(n, dim) {
  dim = dim || 50;
  var points = [];
  for (var i = 0; i < n; i++) {
    var p1 = normalVector(dim);
    points.push(new Point(p1, "#039"));
    var p2 = normalVector(dim);
    p2[0] += 10;
    points.push(new Point(p2, "#f90"));
    var p3 = normalVector(dim);
    p3[0] += 50;
    points.push(new Point(p3, "#6a3"));
  }
  return points;
}

// One tiny cluster inside of a big cluster.
export function subsetClustersData(n, dim) {
  dim = dim || 2;
  var points = [];
  for (var i = 0; i < n; i++) {
    var p1 = normalVector(dim);
    points.push(new Point(p1, "#039"));
    var p2 = normalVector(dim);
    scale(p2, 50);
    points.push(new Point(p2, "#f90"));
  }
  return points;
}

// Data in a rough simplex.
export function simplexData(n, noise) {
  noise = noise || 0.5;
  var points = [];
  for (var i = 0; i < n; i++) {
    var p = [];
    for (var j = 0; j < n; j++) {
      p[j] = i == j ? 1 + noise * normal() : 0;
    }
    points.push(new Point(p));
  }
  return points;
}

// Uniform points from a cube.
export function cubeData(n, dim) {
  var points = [];
  for (var i = 0; i < n; i++) {
    var p = [];
    for (var j = 0; j < dim; j++) {
      p[j] = Math.random();
    }
    points.push(new Point(p));
  }
  return points;
}

// Points in two unlinked rings.
export function unlinkData(n) {
  var points = [];
  function rotate(x, y, z) {
    var u = x;
    var cos = Math.cos(0.4);
    var sin = Math.sin(0.4);
    var v = cos * y + sin * z;
    var w = -sin * y + cos * z;
    return [u, v, w];
  }
  for (var i = 0; i < n; i++) {
    var t = (2 * Math.PI * i) / n;
    var sin = Math.sin(t);
    var cos = Math.cos(t);
    // Ring 1.
    points.push(new Point(rotate(cos, sin, 0), "#f90"));
    // Ring 2.
    points.push(new Point(rotate(3 + cos, 0, sin), "#039"));
  }
  return points;
}

// Points in linked rings.
export function linkData(n) {
  var points = [];
  function rotate(x, y, z) {
    var u = x;
    var cos = Math.cos(0.4);
    var sin = Math.sin(0.4);
    var v = cos * y + sin * z;
    var w = -sin * y + cos * z;
    return [u, v, w];
  }
  for (var i = 0; i < n; i++) {
    var t = (2 * Math.PI * i) / n;
    var sin = Math.sin(t);
    var cos = Math.cos(t);
    // Ring 1.
    points.push(new Point(rotate(cos, sin, 0), "#f90"));
    // Ring 2.
    points.push(new Point(rotate(1 + cos, 0, sin), "#039"));
  }
  return points;
}

// Points in a trefoil knot.
export function trefoilData(n) {
  var points = [];
  for (var i = 0; i < n; i++) {
    var t = (2 * Math.PI * i) / n;
    var x = Math.sin(t) + 2 * Math.sin(2 * t);
    var y = Math.cos(t) - 2 * Math.cos(2 * t);
    var z = -Math.sin(3 * t);
    points.push(new Point([x, y, z], angleColor(t)));
  }
  return points;
}

// Two long, linear clusters in 2D.
export function longClusterData(n) {
  var points = [];
  var s = 0.03 * n;
  for (var i = 0; i < n; i++) {
    var x1 = i + s * normal();
    var y1 = i + s * normal();
    points.push(new Point([x1, y1], "#039"));
    var x2 = i + s * normal() + n / 5;
    var y2 = i + s * normal() - n / 5;
    points.push(new Point([x2, y2], "#f90"));
  }
  return points;
}

// Mutually orthogonal steps.
export function orthoCurve(n) {
  var points = [];
  for (var i = 0; i < n; i++) {
    var coords = [];
    for (var j = 0; j < n; j++) {
      coords[j] = j < i ? 1 : 0;
    }
    var t = (1.5 * Math.PI * i) / n;
    points.push(new Point(coords, angleColor(t)));
  }
  return points;
}

// Random walk
export function randomWalk(n, dim) {
  var points = [];
  var current = [];
  for (var i = 0; i < dim; i++) {
    current[i] = 0;
  }
  for (var i = 0; i < n; i++) {
    var step = normalVector(dim);
    var next = current.slice();
    for (var j = 0; j < dim; j++) {
      next[j] = current[j] + step[j];
    }
    var t = (1.5 * Math.PI * i) / n;
    points.push(new Point(next, angleColor(t)));
    current = next;
  }
  return points;
}

// Random jump: a random walk with
// additional noise added at each step.
export function randomJump(n, dim) {
  var points = [];
  var current = [];
  for (var i = 0; i < dim; i++) {
    current[i] = 0;
  }
  for (var i = 0; i < n; i++) {
    var step = normalVector(dim);
    var next = add(step, current.slice());
    var r = normalVector(dim);
    scale(r, Math.sqrt(dim));
    var t = (1.5 * Math.PI * i) / n;
    var coords = add(r, next);
    points.push(new Point(coords, angleColor(t)));
    current = next;
  }
  return points;
}

function multiplyScalar(vector, x) {
  return vector.map(val => val * x);
}

function addNoise(vector, x) {
  return vector.map(val => {
    const noise = Math.random() * x - x / 2;
    return val + noise;
  });
}

export function star(n, nArms, dim) {
  const points = [];
  const pointsPerArm = Math.floor(n / nArms);
  for (let i = 0; i < nArms; i++) {
    const color = angleColor((Math.PI * 2 * i) / nArms);
    const armVector = normalVector(dim);
    for (let i = 0; i < pointsPerArm; i++) {
      const percent = i / pointsPerArm;
      const noise = 0.01;
      const p = addNoise(multiplyScalar(armVector, percent), noise);
      points.push(new Point(p, color));
    }
  }
  return points;
}

function interpolate(a, b, percent) {
  return a.map((val, i) => {
    const d = b[i] - val;
    return d * percent + val;
  });
}

export function linkedClusters(nClusters, perCluster, perLink, dim) {
  const points = [];
  const centroids = [];
  for (let i = 0; i < nClusters; i++) {
    const color = angleColor((Math.PI * 2 * i) / nClusters);
    const centroid = normalVector(dim);
    centroids.push(centroid);

    for (let i = 0; i < perCluster; i++) {
      const p = addNoise(centroid, 0.2);
      points.push(new Point(p, color));
    }

    if (i > 0) {
      const lastCentroid = centroids[i - 1];
      for (let i = 0; i < perLink; i++) {
        const percent = i / perLink;
        const p = interpolate(centroid, lastCentroid, percent);
        points.push(new Point(addNoise(p, 0.01), "darkgray"));
      }
    }
  }
  return points;
}

function drawLine(ctx, angle, nPixels) {
  const center = nPixels / 2;
  const lineDistance = nPixels * 2;

  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  ctx.fillRect(0, 0, nPixels, nPixels);

  const dY = Math.sin(angle) * lineDistance;
  const dX = Math.cos(angle) * lineDistance;

  ctx.beginPath();
  ctx.moveTo(center - dX, center - dY);
  ctx.lineTo(center + dX, center + dY);
  ctx.stroke();

  const { data } = ctx.getImageData(0, 0, nPixels, nPixels);
  const pixelData = [];
  for (let j = 0; j < data.length; j += 4) {
    pixelData.push(data[j]);
  }

  return pixelData;
}

export function continuousLineImages(nLines, nPixels = 28) {
  const canvas = createCanvas(nPixels, nPixels);
  const ctx = canvas.getContext("2d");

  const output = [];
  for (let i = 0; i < nLines; i++) {
    const progress = i / nLines;
    const angle = Math.PI * progress;
    const pixelData = drawLine(ctx, angle, nPixels);

    output.push(new Point(pixelData, angleColor(angle)));
  }
  return output;
}

export function clusteredLineImages(
  nLines,
  nClusters,
  noiseParam = 25,
  nPixels = 28
) {
  const canvas = createCanvas(nPixels, nPixels);
  const ctx = canvas.getContext("2d");

  const linesPerCluster = Math.floor(nLines / nClusters);

  const output = [];
  for (let i = 0; i < nClusters; i++) {
    const progress = i / nClusters;

    for (let j = 0; j < linesPerCluster; j++) {
      const noise = Math.random() * (noiseParam / 100) * Math.PI;
      const angle = Math.PI * progress + noise;
      const pixelData = drawLine(ctx, angle, nPixels);
      output.push(new Point(pixelData, angleColor(angle * 2)));
    }
  }
  return output;
}

export function linePreview() {
  const nPixels = Array.prototype.slice.apply(arguments).pop();
  const output = [];
  for (let x = 0; x < nPixels; x++) {
    for (let y = 0; y < nPixels; y++) {
      const vector = [x, y];
      output.push(new Point(vector, y === x ? "aliceblue" : "black"));
    }
  }
  return output;
}

export function lineClusterPreview() {
  const nPixels = Array.prototype.slice.apply(arguments).pop();
  const output = [];
  for (let x = 0; x < nPixels; x++) {
    for (let y = 0; y < nPixels; y++) {
      const vector = [x, y];
      output.push(new Point(vector, y === nPixels - x ? "aliceblue" : "black"));
    }
  }
  return output;
}

export function sineFrequency(nVectors, vectorSize) {
  const minFreq = Math.PI / (2 * vectorSize);
  const maxFreq = Math.PI / ((1 / 10) * vectorSize);

  const output = [];
  for (let i = 0; i < nVectors; i++) {
    const progress = i / nVectors;
    const freq = (maxFreq - minFreq) * progress + minFreq;

    const vector = [];
    for (let x = 0; x < vectorSize; x++) {
      vector.push(Math.sin(freq * x));
    }
    output.push(new Point(vector, angleColor(Math.PI * 2 * progress)));
  }
  return output;
}

export function sinePhase(nVectors, vectorSize) {
  const freq = (2 * Math.PI) / vectorSize;
  const phase = vectorSize / nVectors;

  const output = [];
  for (let i = 0; i < nVectors; i++) {
    const progress = i / nVectors;
    const phaseOffset = phase * progress;

    const vector = [];
    for (let x = 0; x < vectorSize; x++) {
      vector.push(Math.sin(freq * (x + phaseOffset)));
    }
    output.push(new Point(vector, angleColor(Math.PI * 2 * progress)));
  }
  return output;
}

export function sinePreview(nPoints, angle) {
  const amplitude = nPoints / 2;
  const freq = Math.PI / (nPoints / 5);

  const output = [];
  for (let x = 0; x < nPoints; x++) {
    const progress = x / nPoints;
    const vector = [x, Math.sin(freq * x) * amplitude];
    output.push(new Point(vector, angleColor(angle)));
  }
  return output;
}

export function sineFreqPreview(nPoints) {
  return sinePreview(nPoints, 0);
}

export function sinePhasePreview(nPoints) {
  return sinePreview(nPoints, Math.PI / 2);
}
