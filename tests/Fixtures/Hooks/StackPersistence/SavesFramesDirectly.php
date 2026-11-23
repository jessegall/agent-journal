<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StackPersistence;

use App\Values\StackTarget;
use App\Models\Agents\AgentStackRow;
use App\Support\Storage\FrameRecords;
use App\Support\Ticks\TickingTypes;

/**
 * A new action that saves a stack's frames itself, around the shared path, which the stack persistence check refuses.
 */
final readonly class SavesFramesDirectly
{
    public function save(StackTarget $target, FrameRecords $frames, TickingTypes $ticking): void
    {
        $row = AgentStackRow::lockFor($target);

        $row->saveFrames($frames, $ticking);
    }
}
