import type { InjectionKey, Ref } from "vue";
import { inject, provide } from "vue";

/**
 * The user's folds in one dock, by placement and part path, and how a part changes its own; the stack provides them
 * and a disclosure reads them, however deep it sits.
 */
type DockFolds = {
  folds: Ref<Record<string, boolean>>;
  fold: (path: string, open: boolean) => void;
};

const key: InjectionKey<DockFolds> = Symbol("dock folds");

export function provideDockFolds(folds: DockFolds): void {
  provide(key, folds);
}

export function useDockFolds(): DockFolds {
  const folds = inject(key);

  if (folds === undefined) {
    throw MissingDockFolds.here();
  }

  return folds;
}

/**
 * A dock part was drawn outside a dock stack, which holds the folds.
 */
class MissingDockFolds extends Error {
  static here(): MissingDockFolds {
    return new MissingDockFolds("A dock part is drawn outside its dock stack.");
  }
}
