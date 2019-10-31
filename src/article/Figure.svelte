<script>
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
</script>

<style>
  figure {
    width: 110%;
    margin-left: -5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 18px;
  }

  .figure-container {
    max-width: 1000px;
    width: 100%;
  }

  caption {
    margin: 20px 0;
    font-style: italic;
    width: 80%;
    font-size: 13px;
  }
</style>

<figure>
  <div class="figure-container">
    <slot />
  </div>
  <caption>
    <slot name="caption" />
  </caption>
</figure>
