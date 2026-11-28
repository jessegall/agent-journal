<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a saved layout holds: the pane grid and the windows detached from it, the last on top.
 */
final class LayoutShape extends Data
{
    /**
     * @param  list<DetachedWindowData>  $detached
     */
    public function __construct(
        public readonly PaneNodeData $grid,
        #[DataCollectionOf(DetachedWindowData::class)]
        public readonly array $detached,
    ) {}

    /** @param list<string> $keys */
    public function keepingWindows(array $keys): self
    {
        $available = fn (string $key): bool => in_array(explode('~', $key, 2)[0], $keys, true);

        return self::from([
            'grid' => $this->keepingNode($this->grid, $available),
            'detached' => array_values(array_filter(
                $this->detached,
                fn (DetachedWindowData $window) => $available($window->key),
            )),
        ]);
    }

    /** @param callable(string): bool $available */
    private function keepingNode(PaneNodeData $node, callable $available): PaneNodeData
    {
        if ($node instanceof SplitData) {
            return clone ($node, [
                'first' => $this->keepingNode($node->first, $available),
                'second' => $this->keepingNode($node->second, $available),
            ]);
        }

        if ($node instanceof PaneData) {
            $keys = array_values(array_filter($node->windows, $available));

            return clone ($node, [
                'windows' => $keys,
                'active' => in_array($node->active, $keys, true) ? $node->active : ($keys[0] ?? null),
            ]);
        }

        return $node;
    }
}
