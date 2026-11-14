// Round fourteen, the bars over Home (message 121276). Replaces by name: HomeBars. The agent bar is round-fifteen.jsx's. Unchanged parts look as the app has them (121184).
// The layout control is the app's icon button, Presets (agents/LayoutPicker.vue:20-21), at the end of the information bar (PaneStage.vue:359-363),
// not a 'Layout: Default' text dropdown. Its list floats (FloatMenu).

Object.assign(ICONS, {layout: "M2.5 3h11v10h-11zM7 3v10M7 8h6.5"});

function HomeBars() {
  const [layout, setLayout] = useState("Default");
  return <>
    <HomeAgentBar />
    <InfoBar end={<span className="now-layout"><FloatMenu align="right" width={240} button={({toggle, open}) => <button type="button" className={"btn icon r14-layout" + (open ? " on" : "")} data-presets title="Presets" aria-label="Presets" onClick={toggle}><Icon name="layout" size={12} /></button>}>{(close) => <>
      <div className="menu-label">Presets</div>
      {LAYOUTS.map(([l, d]) => <MenuItem key={l} check={l === layout} desc={d} onClick={() => { setLayout(l); close(); }}>{l}</MenuItem>)}
    </>}</FloatMenu></span>} />
  </>;
}

Object.assign(window, {HomeBars});
