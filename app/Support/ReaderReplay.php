<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\VerificationContract;
use App\Models\PartRun;
use App\Models\ReaderRevision;
use App\Values\ReaderCheckpoint;
use App\Values\ReplayedOutput;

/**
 * Replays a reader revision over every stream a part wrote, from its stored committed chunks, as a proof and an
 * assessment both read a run.
 */
final readonly class ReaderReplay
{
    public function __construct(private StoredOutput $output) {}

    public function replay(ReaderRevision $reader, VerificationContract $contract, PartRun $part): ReplayedOutput
    {
        $replay = new DeclarativeReader($reader->readerDefinition(), $contract->output, $reader->id);
        $checkpoint = new ReaderCheckpoint();

        foreach ($part->recordedStreams() as $stream) {
            $checkpoint = $replay->read($checkpoint, ...$this->output->frames($part, $stream, 0));
        }

        return new ReplayedOutput($checkpoint, $replay->finish($checkpoint, $part->end()));
    }
}
