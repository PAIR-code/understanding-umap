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
  
export const times = {
  umap: [
    { n: 3, t: "25s" },
    { n: 5, t: "34s" },
    { n: 10, t: "51s" },
    { n: 15, t: "1m 2s" },
    { n: 20, t: "1m 11s" },
    { n: 50, t: "1m 56s" },
    { n: 100, t: "2m 30s" },
    { n: 200, t: "3m 22s" }
  ],
  tsne: [
    { p: 5, t: "9m 18s" },
    { p: 15, t: "10m 7s" },
    { p: 30, t: "11m 5s" },
    { p: 50, t: "12m 42s" },
    { p: 100, t: "16m 1s" },
    { p: 200, t: "22m 16s" },
    { p: 500, t: "42m 24s" },
    { p: 1000, t: "1h 16m" },
    { p: 200, t: "2h 5m", fake: true }
  ]
};
