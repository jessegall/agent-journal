<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Models\Runs\PartRun;
use App\Reads\Contracts\OutputRecorder;
use App\Reads\Values\OutputPosition;
use App\Values\CapturedChunk;
use App\Values\PartEnd;

/**
 * An output recorder for tests: it keeps each part's bytes per stream in memory.
 */
final class CollectedOutput implements OutputRecorder
{
    /**
     * @var array<string, array<string, string>>
     */
    private array $bytes = [];

    public function append(CapturedChunk $chunk): OutputPosition
    {
        $this->bytes[$chunk->part->id][$chunk->stream->value] = ($this->bytes[$chunk->part->id][$chunk->stream->value]
            ?? '').$chunk->bytes;

        return new OutputPosition($chunk->stream, strlen($this->bytes[$chunk->part->id][$chunk->stream->value]));
    }

    public function finish(PartRun $part, PartEnd $end): void {}

    public function stdoutOf(PartRun $part): string
    {
        return $this->bytes[$part->id]['stdout'] ?? '';
    }
}
