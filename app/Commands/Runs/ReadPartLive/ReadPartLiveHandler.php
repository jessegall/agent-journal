<?php

declare(strict_types=1);

namespace App\Commands\Runs\ReadPartLive;

use App\Contracts\Bus\CommandHandler;
use App\Models\Runs\PartRun;
use App\Models\Runs\ReaderPosition;
use App\Support\DeclarativeReader;
use App\Support\PartAssessments;
use App\Support\RunUpdates;
use App\Support\StoredOutput;
use App\Values\OutputProblem;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Advances the live reader of a part over its committed output. A reader that throws, overruns its time budget or
 * meets an oversized record is marked failed on its own position; capture and the activity view go on untouched.
 */
final readonly class ReadPartLiveHandler implements CommandHandler
{
    public function __construct(
        private PartAssessments $assessments,
        private StoredOutput $output,
        private RunUpdates $updates,
        private LoggerInterface $log,
    ) {}

    public function handle(ReadPartLiveCommand $command): string
    {
        $part = PartRun::query()->whereKey($command->partRunId)->sole();
        $pairs = $this->assessments->pairOf($part);

        if ($pairs === []) {
            return '';
        }

        $position = ReaderPosition::of($part, $pairs[0]->reader);

        if ($position->hasFailed()) {
            return $position->interpretation->value;
        }

        $definition = $pairs[0]->reader->definition;
        $reader = new DeclarativeReader($definition, $pairs[0]->contract->output, $position->reader_revision_id);
        $checkpoint = $position->checkpoint;

        try {
            foreach ($part->recordedStreams() as $stream) {
                $frames = $this->output->frames($part, $stream, $checkpoint->offsetOf($stream));
                $checkpoint = $reader->read($checkpoint, ...$frames);
            }
        } catch (Throwable $failure) {
            $this->log->error(
                "The live reader of part run {$command->partRunId} failed: "
                    .$failure::class.": {$failure->getMessage()}",
                [
                    'part_run' => $command->partRunId,
                    'exception' => $failure,
                ],
            );

            $position->markFailed();

            return $position->interpretation->value;
        }

        $position->advance($checkpoint);
        $this->updates->progressed($part);

        if (array_any($checkpoint->problems, fn (OutputProblem $problem): bool => $problem->code->isReaderFailure())) {
            $position->markFailed();
        }

        return $position->interpretation->value;
    }
}
