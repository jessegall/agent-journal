# Building strings in the viewer — examples

Bad:

```javascript
const key = computed(() => route.view + ":" + (route.params.env || ""));
el.style.height = Math.min(el.scrollHeight, 120) + "px";
```

Good:

```javascript
const key = computed(() => `${route.view}:${route.params.env || ""}`);
el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
```
