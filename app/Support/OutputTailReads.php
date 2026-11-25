<?php

declare(strict_types=1);

namespace App\Support;

use App\Api\Processes\OutputTail;
use App\Commands\CommandRules\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\CommandRules\EvidenceSource;
use App\Enums\Processes\OutputStream;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Values\EvidenceRange;

/**
 * Reads the last lines of a run part's stream and records the bytes read as evidence read, for a call and a tool
 * alike.
 */
final readonly class OutputTailReads
{
    public function __construct(private StoredOutput $output, private CommandBus $commands) {}

    public function tail(string $runId, int $part, OutputStream $stream, int $lines): OutputTail
    {
        $run = ProcessRun::query()->findOrFail($runId);
        $attempt = PartRun::findLatestAttemptAt($run, $part);
        $tail = $this->output->tail($attempt, $stream, $lines);
        $range = EvidenceRange::bytes($attempt->id, EvidenceSource::of($stream), $tail['before'], $tail['end']);
        $this->commands->run(new RecordEvidenceReadsCommand($run->id, [$range]));

        return new OutputTail('diagnostic output', $stream->value, $tail['text'], $tail['before'], $tail['end']);
    }
}
