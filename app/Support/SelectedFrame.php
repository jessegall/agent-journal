<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\AgentStackRow;
use App\Support\Storage\FrameRecord;

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

    /**
     * The key of the state type the frame holds.
     */
    public function typeKey(): string
    {
        return $this->record->reference->typeKey;
    }
}
