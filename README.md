# Understanding UMAP

Dimensionality reduction is a powerful tool for machine learning practitioners to visualize and understand large, high dimensional datasets. One of the most widely used techniques for visualization is [t-SNE](https://lvdmaaten.github.io/tsne/), but its performance suffers with large datasets and using it correctly can be [challenging](https://distill.pub/2016/misread-tsne/).

[UMAP](https://github.com/lmcinnes/umap) is a new technique by McInnes et al. that offers a number of advantages over t-SNE, most notably increased speed and better preservation of the data's global structure. In this article, we'll take a look at the theory behind UMAP in order to better understand how the algorithm works, how to use it effectively, and how its performance compares with t-SNE.

```bash
yarn
yarn dev
```

#### Publishing to github pages

```bash
yarn pub
```

#### To develop figures individually

```bash
yarn dev:cech
yarn dev:hyperparameters
yarn dev:mammoth-umap
yarn dev:mammoth-tsne
yarn dev:supplement
yarn dev:toy
yarn dev:toy_comparison
```

#### Data preprocessing

_Understanding UMAP_ uses a few tricks to make the data payloads for some of the interactive figures small enough to download in a reasonable time. The `mammoth` figures use a 10-bit encoding scheme to compress the 10,000 3D points into a significantly smaller payload. The `hyperparameters` and `toy_comparison` figures precompute UMAP embeddings for all of their different combinations, then use the same 10-bit encoding scheme to compress the data.

```bash
yarn preprocess:hyperparameters
yarn preprocess:mammoth
yarn preprocess:toy_comparison
```
