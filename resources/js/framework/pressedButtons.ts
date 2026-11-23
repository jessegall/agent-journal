import { router } from "@inertiajs/vue3";

/**
 * How long a read may run before its button shows the spinner, so a fast one does not flicker the label.
 */
export const SPINNER_AFTER_MS = 120;

const PRESSABLE = 'button, [role="button"], [role="switch"], [role="menuitem"]';

/**
 * One request's hold on the button whose click sent it; a request sent outside a click holds no button.
 */
export class ButtonHold {
  private held = false;

  private readonly timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly control: HTMLElement | null,
    private readonly disabledHere: WeakSet<HTMLElement>,
    delayMs: number,
  ) {
    this.timer =
      control !== null && delayMs > 0
        ? setTimeout(() => this.hold(), delayMs)
        : undefined;

    if (control !== null && delayMs === 0) {
      this.hold();
    }
  }

  /**
   * Gives the button back once the request has ended: the spinner goes and the button can be pressed again.
   */
  release(): void {
    clearTimeout(this.timer);

    if (this.control === null || !this.held) {
      return;
    }

    const left = Number(this.control.dataset.busy) - 1;

    if (left > 0) {
      this.control.dataset.busy = String(left);

      return;
    }

    delete this.control.dataset.busy;

    if (
      this.disabledHere.delete(this.control) &&
      this.control instanceof HTMLButtonElement
    ) {
      this.control.disabled = false;
    }
  }

  private hold(): void {
    if (this.control === null) {
      return;
    }

    this.held = true;
    // The first hold marks the button; a second request from the same click counts on top of it.
    const holds =
      this.control.dataset.busy === undefined
        ? 1
        : Number(this.control.dataset.busy) + 1;
    this.control.dataset.busy = String(holds);

    if (this.control instanceof HTMLButtonElement && !this.control.disabled) {
      this.control.disabled = true;
      this.disabledHere.add(this.control);
    }
  }
}

/**
 * The one place a button shows that its request is in flight, as version 5 did: a click on any button is noted, and a
 * request sent while that click is handled puts a spinner on the button and disables it until the request ends. A read
 * shows the spinner after SPINNER_AFTER_MS; a write shows it at once. No button opts in, and a click that sends no
 * request changes nothing.
 */
export class PressedButtons {
  /**
   * The button just clicked, kept only while its click is handled.
   */
  private pressed: HTMLElement | null = null;

  /**
   * The buttons disabled here rather than by their own page, so only those are enabled again.
   */
  private readonly disabledHere = new WeakSet<HTMLElement>();

  /**
   * Holds the button just clicked, after the delay, until the hold is released.
   */
  hold(delayMs = 0): ButtonHold {
    return new ButtonHold(this.pressed, this.disabledHere, delayMs);
  }

  /**
   * Notes every button click on the page, and holds the clicked button while an Inertia visit it started is in flight.
   */
  watch(): void {
    document.addEventListener("click", (event) => this.note(event), true);

    router.on("before", (event) => {
      const visit = event.detail.visit;
      const hold = this.hold(visit.method === "get" ? SPINNER_AFTER_MS : 0);
      const stopListening = router.on("finish", (finished) => {
        if (finished.detail.visit !== visit) {
          return;
        }

        hold.release();
        stopListening();
      });

      // A visit another listener cancels before it starts never finishes.
      queueMicrotask(() => {
        if (event.defaultPrevented) {
          hold.release();
          stopListening();
        }
      });
    });
  }

  private note(event: MouseEvent): void {
    const control =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(PRESSABLE)
        : null;

    if (control === null) {
      return;
    }

    this.pressed = control;
    setTimeout(() => this.forget(control));
  }

  private forget(control: HTMLElement): void {
    if (this.pressed === control) {
      this.pressed = null;
    }
  }
}

/**
 * The page's one record of pressed buttons, watched from app.ts.
 */
export const pressedButtons = new PressedButtons();
