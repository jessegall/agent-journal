<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages\Tasks;

use App\Settings\Enums\ActionMethod;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFactValueData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationTab;
use Domain\Comments\Data\RecordCommentsPartData;
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
        return $this->pageWithBrief($reader, LayoutPartData::build()
            ->asText()
            ->key('brief')
            ->value($reader->brief)
            ->finish());
    }

    /**
     * The reader opened at a brief passage search found: the Brief tab shows the brief from that passage on, or says
     * the passage is gone when the brief changed since, with no fallback to the summary.
     */
    public function pageAtPassage(TaskReaderData $reader, TaskBriefPassage $passage): DetailPage
    {
        if (! $passage->isOpenIn($reader->brief, $reader->revision)) {
            return $this->pageWithBrief($reader, LayoutPartData::build()
                ->asText()
                ->key('brief')
                ->value(self::PASSAGE_GONE)
                ->style('muted')
                ->finish());
        }

        $excerpt = $passage->excerptOf($reader->brief, $reader->revision, self::PASSAGE_CHARACTERS);

        return $this->pageWithBrief($reader, LayoutPartData::build()
            ->asText()
            ->key('brief')
            ->value($excerpt)
            ->finish());
    }

    private function pageWithBrief(TaskReaderData $reader, LayoutPartData $brief): DetailPage
    {
        return DetailPage::build()->title($reader->title)->finish()
            ->above(LayoutPartData::build()
                ->asText()
                ->key('number')
                ->value("Task {$reader->number}")
                ->style('code')
                ->finish())
            ->summarising($reader->brief)
            ->withActions(...$this->actionsOf($reader))
            ->withFacts(...$this->factsOf($reader))
            ->withTabs(
                PublicationTab::deferred('waits', 'Waits', fn () => $this->waitsOf($reader)),
                PublicationTab::deferred('logs', 'Logs', fn () => $this->logsOf($reader)),
                PublicationTab::deferred('proofs', 'Proofs', fn () => $this->proofsOf($reader)),
                PublicationTab::deferred('comments', 'Comments', fn () => LayoutPartData::build()
                    ->asNative()
                    ->key('comments')
                    ->native(
                        LayoutNativeData::build()
                            ->component('comments/RecordComments')
                            ->props(
                                RecordCommentsPartData::from([
                                    'comments' => $reader->comments,
                                    'target' => $reader->label,
                                ]),
                            )
                            ->finish(),
                    )
                    ->finish()),
                PublicationTab::deferred('brief', 'Brief', fn () => $brief),
            );
    }

    /**
     * @return list<LayoutPartData>
     */
    private function actionsOf(TaskReaderData $reader): array
    {
        $fixed = [
            'revision' => $reader->revision,
            'run' => $reader->actions->runNumber,
        ];

        $address = fn (string $name) => route("tasks.{$name}", ['task' => $reader->number], false);

        $post = fn (string $name) => LayoutFormData::build()
            ->method(ActionMethod::Post)
            ->href($address($name))
            ->fixed($fixed)
            ->isKeyed(true)
            ->finish();

        $startRefusal = $reader->actions->startReason instanceof Optional
            ? 'You may not start this task.'
            : $reader->actions->startReason;

        $parts = [
            $reader->actions->mayStart
                ? LayoutPartData::build()
                    ->asForm()
                    ->key('start')
                    ->form($post('start'))
                    ->style('inline')
                    ->children(
                        LayoutPartData::build()
                            ->asAction()
                            ->key('start-send')
                            ->label('Start')
                            ->action(LayoutActionData::build()->submits(true)->finish())
                            ->style('primary')
                            ->finish(),
                    )
                    ->finish()
                : LayoutPartData::build()
                    ->asAction()
                    ->key('start')
                    ->label('Start')
                    ->action(LayoutActionData::build()->reason($startRefusal)->finish())
                    ->finish(),
        ];

        foreach ([
            'block' => $reader->actions->mayBlock,
            'cancel' => $reader->actions->mayCancel,
        ] as $name => $may) {
            if ($may) {
                $parts[] = LayoutPartData::build()
                    ->asForm()
                    ->key($name)
                    ->form($post($name))
                    ->style('inline')
                    ->children(
                        LayoutPartData::build()
                            ->asField()
                            ->key('reason')
                            ->label('Reason')
                            ->field(LayoutFieldData::build()->name('reason')->finish())
                            ->style('text')
                            ->finish(),
                        LayoutPartData::build()
                            ->asAction()
                            ->key("{$name}-send")
                            ->label(ucfirst($name))
                            ->action(LayoutActionData::build()->submits(true)->finish())
                            ->finish(),
                    )
                    ->finish();
            }
        }

        return $parts;
    }

    /**
     * @return list<LayoutRowData>
     */
    private function factsOf(TaskReaderData $reader): array
    {
        $facts = [self::factRow('state', 'State', $reader->status->badge()[0])];

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
            return LayoutPartData::build()
                ->asNotice()
                ->key('waits')
                ->style('empty')
                ->title('The waits could not be read.')
                ->finish();
        }

        return LayoutPartData::build()
            ->asNative()
            ->key('waits')
            ->native(
                LayoutNativeData::build()
                    ->component('tasks/TaskWaitsTab')
                    ->props(
                        TaskWaitsPartData::from([
                            'waits' => $reader->waits,
                            'actions' => $reader->waitActions,
                            'number' => $reader->number,
                        ]),
                    )
                    ->finish(),
            )
            ->finish();
    }

    private function logsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->logs instanceof Optional) {
            return LayoutPartData::build()
                ->asNotice()
                ->key('logs')
                ->style('empty')
                ->title('The logs could not be read.')
                ->finish();
        }

        return LayoutPartData::build()
            ->asNative()
            ->key('logs')
            ->native(
                LayoutNativeData::build()
                    ->component('tasks/TaskLogsTab')
                    ->props(TaskLogsPartData::from(['logs' => $reader->logs]))
                    ->finish(),
            )
            ->finish();
    }

    private function proofsOf(TaskReaderData $reader): LayoutPartData
    {
        if ($reader->proofs instanceof Optional) {
            return LayoutPartData::build()
                ->asNotice()
                ->key('proofs')
                ->style('empty')
                ->title('The proofs could not be read.')
                ->finish();
        }

        return LayoutPartData::build()
            ->asNative()
            ->key('proofs')
            ->native(
                LayoutNativeData::build()
                    ->component('tasks/TaskProofsTab')
                    ->props(TaskProofsPartData::from(['proofs' => $reader->proofs]))
                    ->finish(),
            )
            ->finish();
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

        return LayoutRowData::build()
            ->key($key)
            ->label($label)
            ->fact(
                LayoutFactValueData::build()
                    ->linkedPieces(
                        array_map(
                            fn (string $number) => [
                                $number,
                                route('tasks.task', ['task' => $number], false),
                            ],
                            $numbers,
                        ),
                    )
                    ->finish(),
            )
            ->finish();
    }

    private static function factRow(string $key, string $label, string $value): LayoutRowData
    {
        return LayoutRowData::build()->key($key)->label($label)->value($value)->finish();
    }
}
