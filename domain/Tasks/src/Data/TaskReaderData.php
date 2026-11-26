<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use App\Navigation\Data\Pages\SlotSectionData;
use App\Support\AssignmentData;
use Domain\Comments\Data\CommentList;
use Domain\Tasks\Enums\TaskStatus;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One task's reader: its number, title, state and revision, and three separate facts: the standing holder, the latest
 * run's number, and who runs it now, each absent when there is none; the sections other domains add beside the facts,
 * such as Plans' plan of the task; then its brief, never its result note in its place, and the Logs and Proofs the
 * reader asked for, its waits when asked, the reason of a block, and its comments under the label they are written
 * against.
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
        public readonly TaskStatus $status,
        public readonly int $revision,
        public readonly string $brief,
        public readonly TaskActionsData $actions,
        public readonly string $label,
        public readonly CommentList $comments,
        #[DataCollectionOf(SlotSectionData::class)]
        public readonly array $sections,
        public readonly AssignmentData|Optional $holder = new Optional(),
        public readonly int|Optional $latestRun = new Optional(),
        public readonly TaskRunnerData|Optional $runningNow = new Optional(),
        public readonly string|Optional $focusedBy = new Optional(),
        public readonly TaskLogsData|Optional $logs = new Optional(),
        public readonly TaskProofsData|Optional $proofs = new Optional(),
        public readonly TaskWaitsData|Optional $waits = new Optional(),
        public readonly TaskWaitActionsData|Optional $waitActions = new Optional(),
        public readonly string|Optional $blockReason = new Optional(),
        public readonly string|Optional $resultNote = new Optional(),
        public readonly string|Optional $cancelReason = new Optional(),
    ) {}

    /**
     * The reader of a task read with its texts, with the sections other domains add and the tabs it was asked for.
     *
     * @param  list<SlotSectionData>  $sections
     */
    public static function fromDetails(
        TaskDetails $details,
        TaskActionsData $actions,
        CommentList $comments,
        array $sections,
        TaskLogsData|Optional $logs,
        TaskProofsData|Optional $proofs,
        TaskWaitsData|Optional $waits,
        TaskWaitActionsData|Optional $waitActions,
    ): self {
        $execution = $details->execution;

        return self::from(array_filter([
            'number' => (string) $details->number,
            'title' => $details->title,
            'status' => $details->status,
            'revision' => $details->revision,
            'brief' => $details->text instanceof TaskText ? $details->text->brief : '',
            'actions' => $actions,
            'label' => "task {$details->number}",
            'comments' => $comments,
            'sections' => $sections,
            'holder' => $details->holder->map(AssignmentData::ofHolder(...))->getOrElse(null),
            'latestRun' => $execution?->runNumber,
            'runningNow' => $execution !== null && $execution->isRunningNow
                ? TaskRunnerData::fromExecution($execution)
                : null,
            'focusedBy' => $execution?->focusedBy->getOrElse(null),
            'logs' => $logs instanceof Optional ? null : $logs,
            'proofs' => $proofs instanceof Optional ? null : $proofs,
            'waits' => $waits instanceof Optional ? null : $waits,
            'waitActions' => $waitActions instanceof Optional ? null : $waitActions,
            'blockReason' => $details->status === TaskStatus::Blocked && $details->text instanceof TaskText
                ? $details->text->blockReason
                : null,
            'resultNote' => $details->status === TaskStatus::Finished && $details->text instanceof TaskText
                ? $details->text->resultNote
                : null,
            'cancelReason' => $details->status === TaskStatus::Cancelled && $details->text instanceof TaskText
                ? $details->text->cancelReason
                : null,
        ], fn (mixed $readerValue) => $readerValue !== null));
    }
}
