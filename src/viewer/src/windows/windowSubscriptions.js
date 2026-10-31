// every follow of every window, kept by the host: a hidden window's events are held back and it hears one refresh
// when it shows again, and the host stops a window's follows when it takes the window down or mounts it again
export class WindowSubscriptions {
    constructor() {
        this.follows = [];
        this.held = new Set();
    }

    follow(window, patterns, heard, visible = () => true) {
        this.follows.push({window, patterns: [].concat(patterns), heard, visible});
    }

    count(window) {
        return this.follows.filter((follow) => follow.window === window).length;
    }

    stopAll(window) {
        this.follows = this.follows.filter((follow) => follow.window !== window);
        this.held = new Set([...this.held].filter((follow) => follow.window !== window));
    }

    dispatch(event) {
        for (const follow of this.follows) {
            if (!follow.patterns.some((pattern) => matches(pattern, event.event))) continue;
            if (follow.visible()) follow.heard(event);
            else this.held.add(follow);
        }
    }

    shown(window) {
        for (const follow of [...this.held].filter((held) => held.window === window)) {
            this.held.delete(follow);
            follow.heard({event: "refresh"});
        }
    }
}

export function matches(pattern, eventName) {
    const [model, change] = pattern.split(".");
    const [eventModel, eventChange] = eventName.split(".");
    return (model === "*" || model === eventModel) && (change === "*" || change === eventChange);
}
