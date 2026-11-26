# Screen frames

A screen frame (`App\Terminals\Data\ScreenFrameData`) is a runtime's screen as its host last captured it.

- Every row comes as styled runs, with the cursor, the buffer and the size, numbered within the host process's epoch.
- A marker frame has no rows and says why: too large to send, unreadable, or no terminal on the host. A plain frame
  dropped its styles to fit.
- A shielded frame stands for a screen its host would not export. The privacy revision rises each time the runtime's
  screen turns from public to shielded.
- The stream names the sender that sent the frame. Its proof, rising per stream, proves the host alive until it
  expires; a host that sends no stream and no proof proves nothing by its frames.
- Who holds the input, whether a take is being settled and the prompt revision a browser writer's input must name come
  with every frame; a grant's own id never does.
- A contained runtime's frames name their attachment and verified container, and a lost attachment whose container
  still runs says so instead of ending.
