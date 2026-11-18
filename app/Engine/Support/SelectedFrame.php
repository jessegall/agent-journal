<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;

/**
 * A stored frame chosen for a tick, with its stack row and its position on it, before its state is restored.
 */
final readonly class SelectedFrame
{
    public function __construct(
        public AgentStackRow $row,
        public FrameRecord $record,
        public int $position = 0,
    ) {}
}
