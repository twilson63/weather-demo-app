# Svelte Weather App part 2

Lets make our little weather app interactive:

Open the `App.html` file and lets add a form tag and an input tag to our main tag.

```
<main>
  ...
  <form>
    <input type="text" />
  </form>
</main>
```

Next lets add some state to handle the input

```
// state 
...
let location = ''

```

And lets add a function to handle the submit of the form

```
function getWeather() {
  fetch(`https://weather.twilson63.xyz/?q=${location}`)
    .then(r => r.json())
    .then(doc => {
      weather = doc
    })
}
```

Wire up the presentation to the state and functionality.

```
<main>
  ...
  <form on:submit|preventDefault={getWeather}>
    <input type="text" bind:value={location}>
  </form>
</main>
```

Now you should be able to type a city and get the weather.

But we should have handle a couple more cases.

We want to handle the loading case, when the app is getting data from the server.

Download this spinner.svg or use your favorite spinner.svg.

```
wget -O public/spinner.svg https://files-pclriubsof.now.sh
```

Lets create a state flag for loading.

```
// state
...
let loading = true
```

Now lets add the spinner to our markup

```
<main>
  {#if loading}
  <img src="/spinner.svg" alt="loading weather" />
  {:else}
     ...
  {/if}
</main>
```
 
Finally, lets turn loading off when we got our result.

```
onMount(() => {
  location = 'Charleston'
  getWeather()
})
```

```
function getWeather() {
  fetch(...)
    .then(r => r.json())
    .then(doc => {
       weather = doc
       loading = false
    })
}
```



