import { decode, fromString } from "../../../shared/js/parse-binary";
import { N_BITS_HYPERPARAMETERS } from "../../../shared/js/parameters";

const dataCache = new Map();

function process(compressed) {
  const processed = compressed.map((entry, index) => {
    // Define an object with getter for lazy processing of the data for each key
    const object = {};
    Object.keys(entry).forEach(key => {
      Object.defineProperty(object, key, {
        get: function() {
          const cacheKey = `${index}:${key}`;
          if (dataCache.has(cacheKey)) return dataCache.get(cacheKey);

          const encoded = entry[key];
          const { data, length, nDimensions, ranges } = encoded;
          const byteArray = fromString(atob(data));
          const decoded = decode(
            byteArray,
            nDimensions * length,
            N_BITS_HYPERPARAMETERS
          );
          const unzipped = [];
          const [rangeX, rangeY] = ranges;
          const { min: minX, max: maxX } = rangeX;
          const { min: minY, max: maxY } = rangeY;
          const scale = 2 ** N_BITS_HYPERPARAMETERS;
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
    return object;
  });
  return processed;
}

export async function loadData() {
  const res = await fetch(`hyperparameters_encoded.json`);
  const json = await res.json();
  return process(json);
}
