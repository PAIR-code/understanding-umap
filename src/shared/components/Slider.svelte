<script>
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

  export let value;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let onChange = () => {};

  const onSliderChange = e => {
    onChange(e.target.value);
  };
</script>

<style>
  /* Resets */

  input[type="range"] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
    border: none;
    margin: 0;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type="range"]:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  input[type="range"]::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  /* Thumb */

  /* Special styling for WebKit/Blink */
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: steelblue;
    cursor: pointer;
    margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
  }

  /* All the same stuff for Firefox */
  input[type="range"]::-moz-range-thumb {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: steelblue;
    cursor: pointer;
    border: none;
  }

  /* All the same stuff for IE */
  input[type="range"]::-ms-thumb {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: grey;
    cursor: pointer;
  }

  /* Track */

  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: none;
  }

  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: rgba(0, 0, 0, 0.15);
  }

  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: none;
  }

  input[type="range"]::-ms-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: none;
  }
  input[type="range"]::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.1);
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.1);
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.1);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.1);
  }
</style>

<input type="range" {min} {max} {step} bind:value on:change={onSliderChange} />
