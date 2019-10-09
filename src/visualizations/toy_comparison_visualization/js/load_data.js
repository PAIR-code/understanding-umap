import { decode, fromString } from "../../../shared/js/parse-binary";
import { N_BITS_TOY_COMPARISON } from "../../../shared/js/parameters";

const dataCache = new Map();

function process(compressed) {
  const processed = compressed.map((entry, index) => {
    Object.keys(entry).forEach(tsneOrUmap => {
      const dict = entry[tsneOrUmap];
      // Define an object with getter for lazy processing of the data for each key
      const object = {};
      Object.keys(dict).forEach(key => {
        Object.defineProperty(object, key, {
          get: function() {
            const cacheKey = `${tsneOrUmap}:${index}:${key}`;
            if (dataCache.has(cacheKey)) return dataCache.get(cacheKey);

            const encoded = dict[key];
            const { data, length, nDimensions, ranges } = encoded;
            const byteArray = fromString(atob(data));
            const decoded = decode(
              byteArray,
              nDimensions * length,
              N_BITS_TOY_COMPARISON
            );
            const unzipped = [];
            const [rangeX, rangeY] = ranges;
            const { min: minX, max: maxX } = rangeX;
            const { min: minY, max: maxY } = rangeY;
            const scale = 2 ** N_BITS_TOY_COMPARISON;
            for (let i = 0; i < decoded.length; i += 2) {
              const x = (decoded[i] / scale) * (maxX - minX) + minX;
              const y = (decoded[i + 1] / scale) * (maxY - minY) + minY;
              unzipped.push([x, y]);
            }

            dataCache.set(cacheKey, unzipped);
            return unzipped;
          },
          enumerable: true
        });
      });
      entry[tsneOrUmap] = object;
    });
    return entry;
  });

  return processed;
}

export async function loadData() {
  const res = await fetch(`toy_comparison_encoded.json`);
  const json = await res.json();
  return process(json);
}
