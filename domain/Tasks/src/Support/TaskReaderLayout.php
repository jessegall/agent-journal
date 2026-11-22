<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Enums\ActionMethod;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationTab;
use Domain\Tasks\Data\TaskCommentsData;
use Domain\Tasks\Data\TaskLogsPartData;
use Domain\Tasks\Data\TaskProofsPartData;
use Domain\Tasks\Data\TaskReaderData;
use Domain\Tasks\Data\TaskWaitsPartData;
use Spatie\LaravelData\Optional;

/**
 * A task's reader as the shared reader recipe: its number above the wrapping title, its brief, the start, block and
 * cancel it allows as forms, its facts, and its Waits, Logs and Proofs as tabs of native parts, of which only
 * the one the reader opened was read.
 */
final readonly class TaskReaderLayout
{
    public function page(TaskReaderData $reader): DetailPage
    {
        return DetailPage::make($reader->title)
            ->above(LayoutPartData::text('number', "Task {$reader->number}", 'code'))
            ->summarising($reader->brief)
            ->withActions(...$this->actionsOf($reader))
            ->withFacts(...$this->factsOf($reader))
            ->withTabs(
                PublicationTab::deferred('waits', 'Waits', fn () => $this->waitsOf($reader)),
                PublicationTab::deferred('logs', 'Logs', fn () => $this->logsOf($reader)),
                PublicationTab::deferred('proofs', 'Proofs', fn () => $this->proofsOf($reader)),
                PublicationTab::deferred('comments', 'Comments', fn () => LayoutPartData::native(
                    'comments',
                    LayoutNativeData::of('tasks/TaskCommentsTab', new TaskCommentsData($reader->comments, $reader->label)),
                )),
            );
    }

    /**
     * @return list<LayoutPartData>
     */
    private function actionsOf(TaskReaderData $reader): array
    {
        $fixed = ['revision' => $reader->revision, 'run' => $reader->actions->runNumber];
        $address = fn (string $name) => route("tasks.{$name}", ['task' => $reader->number], false);
        $post = fn (string $name) => new LayoutFormData(ActionMethod::Post, $address($name), $fixed, isKeyed: true);

        $parts = [
            $reader->actions->mayStart
                ? LayoutPartData::form(
                    'start',
                    $post('start'),
                    'inline',
                    LayoutPartData::action('start-send', 'Start', LayoutActionData::submitting(), 'primary'),
                )
                : LayoutPartData::action(
                    'start',
                    'Start',
                    LayoutActionData::unavailable($reader->actions->startReason instanceof Optional
                        ? 'You may not start this task.'
                        : $reader->actions->startReason),
                ),
        ];

        foreach (['block' => $reader->actions->mayBlock, 'cancel' => $reader->actions->mayCancel] as $name => $may) {
            if ($may) {
                $parts[] = LayoutPartData::form(
                    $name,
                    $post($name),
                    'inline',
                    LayoutPartData::field('reason', 'Reason', new LayoutFieldData('reason'), 'text'),
                    LayoutPartData::action("{$name}-send", ucfirst($name), LayoutActionData::submitting()),
                );
            }
        }

        return $parts;
    }

    /**
     * @return list<LayoutRowData>
     */
    private function factsOf(TaskReaderData $reader): array
    {
        $facts = [new LayoutRowData('state', 'State', ucfirst($reader->state->value))];

        $facts[] = new LayoutRowData(
            'holder',
            'Held by',
            $reader->holder instanceof Optional ? 'Nobody yet' : $reader->holder->label(),
        );

        if (! $reader->latestRun instanceof Optional) {
            $facts[] = new LayoutRowData('run', 'Latest run', (string) $reader->latestRun);
        }

        foreach ([
            'block' => ['Blocked because', $reader->blockReason],
            'result' => ['Result', $reader->resultNote],
            'cancel' => ['Cancelled because', $reader->cancelReason],
        ] as $key => [$label, $text]) {
            if (! $text instanceof Optional && $text !== '') {
                $facts[] = new LayoutRowData($key, $label, $text);
            }
        }

        return $facts;
    }

    private function waitsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->waits instanceof Optional || $reader->waitActions instanceof Optional) {
            return LayoutPartData::notice('waits', 'empty', 'The waits could not be read.');
        }

        return LayoutPartData::native('waits', LayoutNativeData::of(
            'tasks/TaskWaitsTab',
            new TaskWaitsPartData($reader->waits, $reader->waitActions, $reader->number),
        ));
    }

    private function logsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->logs instanceof Optional) {
            return LayoutPartData::notice('logs', 'empty', 'The logs could not be read.');
        }

        return LayoutPartData::native(
            'logs',
            LayoutNativeData::of('tasks/TaskLogsTab', new TaskLogsPartData($reader->logs)),
        );
    }

    private function proofsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->proofs instanceof Optional) {
            return LayoutPartData::notice('proofs', 'empty', 'The proofs could not be read.');
        }

        return LayoutPartData::native(
            'proofs',
            LayoutNativeData::of('tasks/TaskProofsTab', new TaskProofsPartData($reader->proofs)),
        );
    }
}
