<?php

declare(strict_types=1);

namespace App\Terminals\Data;

use App\Terminals\Enums\PaneNodeType;
use App\Terminals\Enums\SplitAxis;

/**
 * A split of the grid into two nodes along an axis, the first taking the ratio of the room.
 */
final class SplitData extends PaneNodeData
{
    public function __construct(
        public readonly string $id,
        public readonly SplitAxis $axis,
        public readonly float $ratio,
        public readonly PaneNodeData $first,
        public readonly PaneNodeData $second,
    ) {
        parent::__construct(PaneNodeType::Split);
    }
}
