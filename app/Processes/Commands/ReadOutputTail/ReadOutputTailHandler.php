<?php

declare(strict_types=1);

namespace App\Processes\Commands\ReadOutputTail;

use App\Api\Processes\OutputTail;
use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Enums\EvidenceSource;
use App\Models\CommandRules\EvidenceRead;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\StoredOutput;
use App\Values\EvidenceRange;

final readonly class ReadOutputTailHandler implements CommandHandler
{
    public function __construct(private StoredOutput $output) {}

    public function handle(ReadOutputTailCommand $command): OutputTail
    {
        $run = ProcessRun::query()->whereKey($command->processRunId)->sole();
        $attempt = PartRun::findLatestAttemptAt($run, $command->part);
        $tail = $this->output->tail($attempt, $command->stream, $command->lines);

        $range = EvidenceRange::bytes(
            $attempt->id,
            EvidenceSource::of($command->stream),
            $tail['before'],
            $tail['end'],
        );

        EvidenceRead::createMany($run, $command->dispatchedBy(), [$range]);

        return new OutputTail(
            'diagnostic output',
            $command->stream->value,
            $tail['text'],
            $tail['before'],
            $tail['end'],
        );
    }
}
