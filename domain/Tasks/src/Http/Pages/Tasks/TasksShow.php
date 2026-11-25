<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages\Tasks;

use App\Enums\ActionMethod;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFactValueData;
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
use Domain\Tasks\Data\TaskWaitItemData;
use Domain\Tasks\Data\TaskWaitsPartData;
use Domain\Tasks\Values\TaskBriefPassage;
use Spatie\LaravelData\Optional;

/**
 * A task's reader as the shared reader recipe: its number above the wrapping title, its brief, the start, block and
 * cancel it allows as forms, its facts, and its Waits, Logs and Proofs as tabs of native parts, of which only
 * the one the reader opened was read.
 */
final readonly class TasksShow extends TasksPage
{
    public const int PASSAGE_CHARACTERS = 2000;

    private const string PASSAGE_GONE = 'That passage of the brief is no longer there; search again.';

    public function page(TaskReaderData $reader): DetailPage
    {
        return $this->pageWithBrief($reader, LayoutPartData::text('brief', $reader->brief));
    }

    /**
     * The reader opened at a brief passage search found: the Brief tab shows the brief from that passage on, or says
     * the passage is gone when the brief changed since, with no fallback to the summary.
     */
    public function pageAtPassage(TaskReaderData $reader, TaskBriefPassage $passage): DetailPage
    {
        if (! $passage->isOpenIn($reader->brief, $reader->revision)) {
            return $this->pageWithBrief($reader, LayoutPartData::text('brief', self::PASSAGE_GONE, 'muted'));
        }

        $excerpt = $passage->excerptOf($reader->brief, $reader->revision, self::PASSAGE_CHARACTERS);

        return $this->pageWithBrief($reader, LayoutPartData::text('brief', $excerpt));
    }

    private function pageWithBrief(TaskReaderData $reader, LayoutPartData $brief): DetailPage
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
                    LayoutNativeData::of(
                        'tasks/TaskCommentsTab',
                        TaskCommentsData::from([
                            'comments' => $reader->comments,
                            'target' => $reader->label,
                        ]),
                    ),
                )),
                PublicationTab::deferred('brief', 'Brief', fn () => $brief),
            );
    }

    /**
     * @return list<LayoutPartData>
     */
    private function actionsOf(TaskReaderData $reader): array
    {
        $fixed = ['revision' => $reader->revision, 'run' => $reader->actions->runNumber];
        $address = fn (string $name) => route("tasks.{$name}", ['task' => $reader->number], false);

        $post = fn (string $name) => LayoutFormData::from([
            'method' => ActionMethod::Post,
            'href' => $address($name),
            'fixed' => $fixed,
            'isKeyed' => true,
        ]);

        $startRefusal = $reader->actions->startReason instanceof Optional
            ? 'You may not start this task.'
            : $reader->actions->startReason;

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
                    LayoutActionData::unavailable($startRefusal),
                ),
        ];

        foreach ([
            'block' => $reader->actions->mayBlock,
            'cancel' => $reader->actions->mayCancel,
        ] as $name => $may) {
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
        $facts = [self::factRow('state', 'State', $reader->state->badge()[0])];

        $holder = $reader->holder instanceof Optional ? 'Nobody yet' : $reader->holder->label();
        $facts[] = self::factRow('holder', 'Holder', $holder);

        if (! $reader->waits instanceof Optional) {
            $facts[] = self::taskLinksRow('waits', 'Waits for', $reader->waits->waitsFor);
            $facts[] = self::taskLinksRow('holds-up', 'Holds up', $reader->waits->holdsUp);
        }

        if (! $reader->latestRun instanceof Optional) {
            $facts[] = self::factRow('run', 'Latest run', (string) $reader->latestRun);
        }

        if (! $reader->focusedBy instanceof Optional) {
            $facts[] = self::factRow('focus', 'In focus of', $reader->focusedBy);
        }

        foreach ([
            'block' => [
                'Blocked because',
                $reader->blockReason,
            ],
            'result' => [
                'Result',
                $reader->resultNote,
            ],
            'cancel' => [
                'Cancelled because',
                $reader->cancelReason,
            ],
        ] as $key => [$label, $text]) {
            if (! $text instanceof Optional && $text !== '') {
                $facts[] = self::factRow($key, $label, $text);
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
            TaskWaitsPartData::from([
                'waits' => $reader->waits,
                'actions' => $reader->waitActions,
                'number' => $reader->number,
            ]),
        ));
    }

    private function logsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->logs instanceof Optional) {
            return LayoutPartData::notice('logs', 'empty', 'The logs could not be read.');
        }

        return LayoutPartData::native(
            'logs',
            LayoutNativeData::of('tasks/TaskLogsTab', TaskLogsPartData::from(['logs' => $reader->logs])),
        );
    }

    private function proofsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->proofs instanceof Optional) {
            return LayoutPartData::notice('proofs', 'empty', 'The proofs could not be read.');
        }

        return LayoutPartData::native(
            'proofs',
            LayoutNativeData::of('tasks/TaskProofsTab', TaskProofsPartData::from(['proofs' => $reader->proofs])),
        );
    }

    /**
     * A fact whose value is the numbers of the tasks on the other side of a wait, each opening its task; none says so.
     *
     * @param  list<TaskWaitItemData>  $items
     */
    private static function taskLinksRow(string $key, string $label, array $items): LayoutRowData
    {
        $numbers = array_values(array_filter(
            array_map(fn (TaskWaitItemData $item) => $item->number, $items),
            fn (string|Optional $number) => ! $number instanceof Optional,
        ));

        if ($numbers === []) {
            return self::factRow($key, $label, 'None');
        }

        return LayoutRowData::from([
            'key' => $key,
            'label' => $label,
            'fact' => LayoutFactValueData::of(array_map(
                fn (string $number) => [
                    $number,
                    route('tasks.task', ['task' => $number], false),
                ],
                $numbers,
            )),
        ]);
    }

    private static function factRow(string $key, string $label, string $value): LayoutRowData
    {
        return LayoutRowData::from([
            'key' => $key,
            'label' => $label,
            'value' => $value,
        ]);
    }
}
