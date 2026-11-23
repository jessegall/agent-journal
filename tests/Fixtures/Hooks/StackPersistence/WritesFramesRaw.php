<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StackPersistence;

use App\Values\StackTarget;
use App\Models\Agents\AgentStackRow;
use App\Support\Storage\FrameRecords;

/**
 * A writer that sets a stack row's frames column itself, which the stack persistence check refuses.
 */
final readonly class WritesFramesRaw
{
    public function replace(StackTarget $target, FrameRecords $frames): void
    {
        $row = AgentStackRow::lockFor($target);
        $row->frames = $frames;
    }
}
