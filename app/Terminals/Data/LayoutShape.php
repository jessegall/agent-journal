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
}
