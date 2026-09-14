# Helper functions in the viewer — examples

Bad:

```javascript
const foldedNames = () => {
  try { return new Set(JSON.parse(localStorage.getItem(FOLDED_KEY) || "[]")); }
  catch (e) { return new Set(); }
};
```

Good:

```javascript
function foldedNames() {
  try { return new Set(JSON.parse(localStorage.getItem(FOLDED_KEY) || "[]")); }
  catch (e) { return new Set(); }
}
```
