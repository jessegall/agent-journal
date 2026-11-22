<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\OutputBytes;
use App\Calls\Processes\ReadOutputBytesCall;
use App\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Contracts\CommandBus;
use App\Enums\EvidenceSource;
use App\Models\ProcessRun;
use App\Support\StoredOutput;
use App\Values\EvidenceRange;

/**
 * Answers a part's whole stream and records it as evidence read.
 */
final readonly class ReadOutputBytesController
{
    public function __invoke(
        ReadOutputBytesCall $call,
        ProcessRun $processRun,
        StoredOutput $output,
        CommandBus $commands,
    ): OutputBytes {
        $part = $processRun->latestAttemptAt($call->part);
        $bytes = $output->bytes($part, $call->stream);
        $range = EvidenceRange::bytes($part->id, EvidenceSource::of($call->stream), 0, strlen($bytes));
        $commands->run(new RecordEvidenceReadsCommand($processRun->id, [$range]));

        return new OutputBytes('diagnostic output', $call->stream->value, base64_encode($bytes), strlen($bytes));
    }
}
