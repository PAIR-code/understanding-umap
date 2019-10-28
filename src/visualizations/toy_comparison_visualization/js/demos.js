/* Copyright 2019 Google Inc. All Rights Reserved.

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

import {
  demos as originalDemos,
  extendedDemos
} from "../../../shared/js/toy-configs";

export const originalOverrides = [
  {
    name: "Grid",
    options: [{ name: "Points Per Side", start: 20 }],
    description: "A square grid with equal spacing between points."
  },
  {
    name: "Two Clusters",
    options: [
      { name: "Points Per Cluster", start: 100 },
      { name: "Dimensions", start: 50 }
    ]
  },
  {
    name: "Three Clusters",
    options: [
      { name: "Points Per Cluster", start: 100 },
      { name: "Dimensions", start: 50 }
    ]
  },
  {
    name: "Two Different-Sized Clusters",
    options: [
      { name: "Points Per Cluster", start: 100 },
      { name: "Dimensions", start: 50 },
      { name: "Scale", start: 5 }
    ]
  },
  {
    name: "Two Long Linear Clusters",
    options: [{ name: "Points Per Cluster", start: 100 }]
  },
  {
    name: "Cluster In Cluster",
    options: [
      { name: "Points Per Cluster", start: 100 },
      { name: "Dimensions", start: 50 }
    ]
  },
  {
    name: "Circle (Evenly Spaced)",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Circle (Randomly Spaced)",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Gaussian Cloud",
    options: [
      { name: "Number Of Points", start: 250 },
      { name: "Dimensions", start: 50 }
    ]
  },
  {
    name: "Ellipsoidal Gaussian Cloud",
    options: [
      { name: "Number Of Points", start: 250 },
      { name: "Dimensions", start: 50 }
    ]
  },
  {
    name: "Trefoil Knot",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Linked Rings",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Unlinked Rings",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Orthogonal Steps",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Random Walk",
    options: [
      { name: "Number Of Points", start: 200 },
      { name: "Dimension", start: 100 }
    ]
  },
  {
    name: "Random Jump",
    options: [
      { name: "Number Of Points", start: 200 },
      { name: "Dimension", start: 100 }
    ]
  },
  {
    name: "Equally Spaced",
    options: [{ name: "Number Of Points", start: 200 }]
  },
  {
    name: "Uniform Distribution",
    options: [
      { name: "Number Of Points", start: 200 },
      { name: "Dimensions", start: 10 }
    ]
  }
];

const extendedOverrides = [
  {
    name: "Star",
    options: [
      { name: "Number of points", start: 300 },
      { name: "Number of arms", start: 12 },
      { name: "Dimensions", start: 10 }
    ]
  },
  {
    name: "Linked Clusters",
    options: [
      { name: "Number of clusters", start: 6 },
      { name: "Points per cluster", start: 100 },
      { name: "Points per link", start: 50 },
      { name: "Dimensions", start: 10 }
    ]
  },
  {
    name: "Rotated lines",
    options: [
      { name: "Number of lines", start: 200 },
      { name: "Pixels per side", start: 28 }
    ]
  },
  {
    name: "Rotated lines, clustered",
    options: [
      { name: "Number of lines", start: 200 },
      { name: "Number of clusters", start: 10 },
      { name: "Noise", start: 8 },
      { name: "Pixels per side", start: 28 }
    ]
  },
  {
    name: "Sine frequency",
    options: [
      { name: "Number of vectors", start: 200 },
      { name: "Vector size", start: 256 }
    ]
  },
  {
    name: "Sine phase",
    options: [
      { name: "Number of vectors", start: 200 },
      { name: "Vector size", start: 256 }
    ]
  }
];

const optionsOverrides = [...extendedOverrides, ...originalOverrides];

const allDemos = [...extendedDemos, ...originalDemos].map((demo, i) => {
  const modified = JSON.parse(JSON.stringify(demo)); // Simple clone
  modified.generator = demo.generator;
  modified.previewOverride = demo.previewOverride;
  modified.options = modified.options.map((option, j) => {
    const override = optionsOverrides[i];
    option.start = override.options[j].start;
    if (override.description) {
      option.description = override.description;
    }
    return option;
  });
  return modified;
});

export default allDemos;
