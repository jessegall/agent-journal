<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\OutputBytes;
use App\Processes\Calls\ReadOutputBytesCall;
use App\Processes\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Processes\Enums\EvidenceSource;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\StoredOutput;
use App\Processes\Values\EvidenceRange;

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
