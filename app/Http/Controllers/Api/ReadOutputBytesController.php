<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\OutputBytes;
use App\Api\Processes\ReadOutputBytesPayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\CommandRules\Enums\EvidenceSource;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\StoredOutput;
use App\Values\EvidenceRange;

/**
 * Answers a part's whole stream and records it as evidence read.
 */
final readonly class ReadOutputBytesController
{
    #[Dispatches(RecordEvidenceReadsCommand::class)]
    public function __invoke(
        ReadOutputBytesPayload $call,
        ProcessRun $processRun,
        StoredOutput $output,
        CommandBus $commands,
    ): OutputBytes {
        $part = PartRun::findLatestAttemptAt($processRun, $call->part);
        $bytes = $output->bytes($part, $call->stream);
        $range = EvidenceRange::bytes($part->id, EvidenceSource::of($call->stream), 0, strlen($bytes));
        $commands->run(new RecordEvidenceReadsCommand($processRun->id, [$range]));

        return new OutputBytes('diagnostic output', $call->stream->value, base64_encode($bytes), strlen($bytes));
    }
}
