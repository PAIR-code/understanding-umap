// import { demos } from "../../toy_visualization/js/demo-configs";
import * as generators from "../../toy_visualization/js/generators";

// export const optionsOverrides = [
//   {
//     name: "Grid",
//     options: [
//       {
//         name: "Points Per Side",
//         start: 20
//       }
//     ]
//   },
//   {
//     name: "Two Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Three Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Two Different-Sized Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       },
//       {
//         name: "Scale",
//         start: 5
//       }
//     ]
//   },
//   {
//     name: "Two Long Linear Clusters",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       }
//     ]
//   },
//   {
//     name: "Cluster In Cluster",
//     options: [
//       {
//         name: "Points Per Cluster",
//         start: 100
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Circle (Evenly Spaced)",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Circle (Randomly Spaced)",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Gaussian Cloud",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 250
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Ellipsoidal Gaussian Cloud",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 250
//       },
//       {
//         name: "Dimensions",
//         start: 50
//       }
//     ]
//   },
//   {
//     name: "Trefoil Knot",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Linked Rings",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Unlinked Rings",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Orthogonal Steps",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Random Walk",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       },
//       {
//         name: "Dimension",
//         start: 100
//       }
//     ]
//   },
//   {
//     name: "Random Jump",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       },
//       {
//         name: "Dimension",
//         start: 100
//       }
//     ]
//   },
//   {
//     name: "Equally Spaced",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       }
//     ]
//   },
//   {
//     name: "Uniform Distribution",
//     options: [
//       {
//         name: "Number Of Points",
//         start: 200
//       },
//       {
//         name: "Dimensions",
//         start: 10
//       }
//     ]
//   }
// ];

// demos.forEach((demo, i) => {
//   demo.options = demo.options.map((option, j) => {
//     option.start = optionsOverrides[i].options[j].start;
//     return option;
//   });
// });

const demos = [
  // {
  //   name: "Star",
  //   description: "Points arranged in a radial star pattern",
  //   options: [
  //     {
  //       name: "Number of points",
  //       start: 300
  //     },
  //     {
  //       name: "Number of arms",
  //       start: 12
  //     },
  //     {
  //       name: "Dimensions",
  //       start: 10
  //     }
  //   ],
  //   generator: generators.star
  // },
  // {
  //   name: "Linked Clusters",
  //   description: "Clusters linked with a chain of points",
  //   options: [
  //     {
  //       name: "Number of clusters",
  //       start: 6
  //     },
  //     {
  //       name: "Points per cluster",
  //       start: 100
  //     },
  //     {
  //       name: "Points per link",
  //       start: 50
  //     },
  //     {
  //       name: "Dimensions",
  //       start: 10
  //     }
  //   ],
  //   generator: generators.linkedClusters
  // },
  // {
  //   name: "Generative function",
  //   description:
  //     "A 2D representatin of a line (length, angle) is used to generate a high dimensional 28x28 image of the line, which is then projected back down to 2D",
  //   options: [
  //     {
  //       name: "Number of clusters",
  //       start: 6
  //     },
  //     {
  //       name: "Points per cluster",
  //       start: 100
  //     },
  //     {
  //       name: "Points per link",
  //       start: 50
  //     },
  //     {
  //       name: "Dimensions",
  //       start: 10
  //     }
  //   ],
  //   generator: generators.linkedClusters
  // }
  {
    name: "Nonlinear Function, smooth",
    description:
      "A rotation parameter controls generation of a line, which is converted into an image and then projected",
    options: [
      {
        name: "Number of lines",
        start: 200
      },
      {
        name: "Pixels per side",
        start: 28
      }
    ],
    generator: generators.continuousLineImages
  },
  {
    name: "Nonlinear Function, clustered",
    description:
      "A rotation parameter controls generation of a line, which is converted into an image and then projected",
    options: [
      {
        name: "Number of lines",
        start: 200
      },
      {
        name: "Number of clusters",
        start: 10
      },
      {
        name: "Pixels per side",
        start: 28
      }
    ],
    generator: generators.clusteredLineImages
  }
];

export default demos;
