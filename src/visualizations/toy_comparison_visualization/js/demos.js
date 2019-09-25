import {
  demos as originalDemos,
  extendedDemos
} from "../../../shared/js/toy-configs";

export const optionsOverrides = [
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
  },
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

const allDemos = [...originalDemos, ...extendedDemos].map((demo, i) => {
  const modified = JSON.parse(JSON.stringify(demo)); // Simple clone
  modified.generator = demo.generator;
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
