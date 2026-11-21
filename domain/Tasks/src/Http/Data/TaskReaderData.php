<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use App\Assignments\Support\AssignmentData;
use App\Ui\Data\SlotSectionData;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Api\TaskText;
use Domain\Tasks\Enums\TaskState;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One task's reader: its number, title, state and revision, and three separate facts: the standing holder, the latest
 * run's number, and who runs it now, each absent when there is none; the sections other domains add beside the facts,
 * such as Plans' plan of the task; then its brief, never its result note in its place.
 */
#[TypeScript]
final class TaskReaderData extends Data
{
    /**
     * @param  list<SlotSectionData>  $sections
     */
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly TaskState $state,
        public readonly int $revision,
        public readonly string $brief,
        #[DataCollectionOf(SlotSectionData::class)]
        public readonly array $sections,
        public readonly AssignmentData|Optional $holder = new Optional(),
        public readonly int|Optional $latestRun = new Optional(),
        public readonly TaskRunnerData|Optional $runningNow = new Optional(),
    ) {}

    /**
     * The reader of a task read with its texts, with the sections other domains add.
     *
     * @param  list<SlotSectionData>  $sections
     */
    public static function fromDetails(TaskDetails $details, array $sections): self
    {
        $execution = $details->execution;

        return self::from(array_filter([
            'number' => (string) $details->number,
            'title' => $details->title,
            'state' => $details->state,
            'revision' => $details->revision,
            'brief' => $details->text instanceof TaskText ? $details->text->brief : '',
            'sections' => $sections,
            'holder' => $details->holder->map(AssignmentData::ofHolder(...))->getOrElse(null),
            'latestRun' => $execution?->runNumber,
            'runningNow' => $execution !== null && $execution->isRunningNow
                ? TaskRunnerData::fromExecution($execution)
                : null,
        ], fn (mixed $readerValue) => $readerValue !== null));
    }
}
