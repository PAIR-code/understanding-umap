# UMAP Article

Svelte app for interactive article about UMAP.

```bash
yarn
yarn dev

# To run individual figures standalone
yarn dev:toy
yarn dev:toy_comparison
yarn dev:cech
yarn dev:hyperparameters
yarn dev:mammoth-umap
yarn dev:mammoth-tsne
```


# Adam TODO

- min_dist axis match styles with text
- x change minDist to min_dist 
- transition mammoth hover on slider (maybe css transitions?) 
x don't rerender on hover 
https://svelte.dev/repl/e570baa8261f468e948e249c028e63e7?version=3.12.1
- x avoid double renders when rotation is on
- x bolding shifts text
- x linked hover mammoth-tsne
- x linked hover hyperparameters
- x linked hover mammoth-umap
- x linked hover fmnist
- x linked hover toy_comparison
