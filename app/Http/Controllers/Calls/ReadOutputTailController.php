<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\OutputTail;
use App\Calls\Processes\ReadOutputTailCall;
use App\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\EvidenceSource;
use App\Models\ProcessRun;
use App\Support\StoredOutput;
use App\Values\EvidenceRange;

/**
 * Answers the last lines of a part's stream and records the bytes read as evidence read.
 */
final readonly class ReadOutputTailController
{
    public function __invoke(
        ReadOutputTailCall $call,
        ProcessRun $processRun,
        StoredOutput $output,
        CommandBus $commands,
    ): OutputTail {
        $part = $processRun->latestAttemptAt($call->part);
        $tail = $output->tail($part, $call->stream, $call->lines);
        $range = EvidenceRange::bytes($part->id, EvidenceSource::of($call->stream), $tail['before'], $tail['end']);
        $commands->run(new RecordEvidenceReadsCommand($processRun->id, [$range]));

        return new OutputTail('diagnostic output', $call->stream->value, $tail['text'], $tail['before'], $tail['end']);
    }
}
