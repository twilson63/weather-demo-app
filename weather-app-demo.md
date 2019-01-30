# Svelte Weather App Demo

Assuming you have your svelte app template up and running, we are going to build a simple weather application to get us started using svelte.

In the App.html file in the source directory, lets mock out our template:

src/App.html

```
<main>
  <img src="https://fillmurray.com/50/50" alt="weather-icon" />
  <h3>Charleston</h3>
  <h1>45 &deg;</h1>
  <h3>Sunny</h3>
</main>

<style>
main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

h3 {
  font-weight: 300;
}

h1 {
  font-size: 4em;
  font-weight: 400;
}
h3 {
  font-size: 2em;
}
</style>
```

Now, lets create some state:

```
<script>

// state
let weather = {
  location: '',
  temp: '0',
  forecast: 'n/a',
  icon: 'https://placehold.it/50/50'
}

</script>
```

and attach the state variables to the template

```
<main>
  <img src="{weather.icon}" alt="{weather.forecast}" />
  <h3>{weather.location}</h3>
  <h1>{weather.temp} &deg;</h1>
  <h3>{weather.forecast}</h3>
</main>

```



and lets make an async call when the component mounts to get the current weather

```
import { onMount } from 'svelte'

// state

// onMount

onMount(() => {
  fetch('https://weather.twilson63.xyz/?q=charleston')
    .then(r => r.json())
    .then(doc => weather = doc)
})


```

Congrats! You should have a little weather application


Lets make it interactive...

