/* @code-commandments-generated */
import { ref as r, watch as i } from "vue";
function c(a, u) {
  a.value = !a.value, a.value || u();
}
function v(a, u, n, d = null) {
  const e = a.props[u], t = r(d), l = r("");
  function o() {
    n.value || (l.value = e.failure.value, e.data.value !== void 0 && (t.value = e.data.value));
  }
  i([e.data, e.failure], o, { immediate: !0 });
  const f = async () => {
    await a.reload(u), o();
  };
  return { data: t, failure: l, loaded: e.loaded, reload: f };
}
export {
  c as t,
  v as u
};
