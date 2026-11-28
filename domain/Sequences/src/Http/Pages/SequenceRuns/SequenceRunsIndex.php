<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\SequenceRuns;

use App\Actors\Contracts\ActorLabels;
use App\Support\ActorReference;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\EmptyListState;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Http\Pages\SequencePageViews;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Values\SequenceRunPage;

/**
 * The runs list: one actor's runs, newest first and numbered by page, with the actors to choose from above them and
 * the chosen run's reader beside them.
 */
final readonly class SequenceRunsIndex extends SequenceRunsPage
{
    private const string EMPTY_TEXT = 'No sequence runs for this actor.';

    public function __construct(private ActorLabels $labels, private SequencePageViews $views) {}

    /**
     * @param  list<ActorReference>  $followers
     * @param  list<LayoutPartData>  $reader  the chosen run's reader, none for the list address
     */
    public function of(
        array $followers,
        ActorReference $follower,
        SequenceRunPage $runs,
        string $chosenRunId = '',
        array $reader = [],
    ): DeclaredLayoutData {
        $query = [
            'actor' => $follower->text(),
            'page' => $runs->page->number,
        ];

        return ListPage::build()
            ->title('Runs')
            ->rows($runs->runs, fn (SequenceRun $run) => $this->rowOf($run, $query, $chosenRunId))
            ->empty(EmptyListState::build()->title(self::EMPTY_TEXT)->finish())
            ->counting($runs->total)
            ->withViews(...$this->views->of(true))
            ->filteredBy($this->choicesOf($followers, $follower))
            ->paged(ListPaging::build()->page($runs->page->number)->lastPage($runs->lastPage())->finish())
            ->withReader(LayoutBackData::build()
                ->href(route('sequences.runs', $query, false))
                ->label('Runs')
                ->finish(), ...$reader)
            ->finish();
    }

    /**
     * The list when no actor follows a run yet.
     */
    public function none(): DeclaredLayoutData
    {
        return ListPage::build()
            ->title('Runs')
            ->rows([], static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title(self::EMPTY_TEXT)->finish())
            ->counting(0)
            ->withViews(...$this->views->of(true))
            ->withReader(LayoutBackData::build()
                ->href(route('sequences.runs', [], false))
                ->label('Runs')
                ->finish())
            ->finish();
    }

    /**
     * @param  array<string, string|int>  $query
     */
    private function rowOf(SequenceRun $run, array $query, string $chosenRunId): LayoutRowData
    {
        $mark = $run->status === SequenceRunStatus::Running
            ? LayoutPartData::build()
                ->asText()
                ->key('step')
                ->value($run->stepLine($run->current_step))
                ->style('chip')
                ->finish()
            : LayoutPartData::build()
                ->asBadge()
                ->key('state')
                ->text(ucfirst($run->status->value))
                ->tone('quiet')
                ->finish();

        return LayoutRowData::build()
            ->key($run->id)
            ->label("Run {$run->number}")
            ->detail($run->name)
            ->href(route('sequences.run', ['run' => $run->number, ...$query], false))
            ->isCurrent($run->id === $chosenRunId)
            ->trailing([$mark])
            ->finish();
    }

    /**
     * @param  list<ActorReference>  $followers
     */
    private function choicesOf(array $followers, ActorReference $chosen): LayoutPartData
    {
        $labels = $this->labels->labelsFor($followers);

        return LayoutPartData::build()
            ->asCollection()
            ->key('actors')
            ->style('choices')
            ->rows(
                array_map(
                    fn (ActorReference $follower) => LayoutRowData::build()
                        ->key($follower->text())
                        ->label($labels->nameOf($follower) ?? $follower->text())
                        ->query(['actor' => $follower->text(), 'page' => ''])
                        ->isCurrent($follower->text() === $chosen->text())
                        ->finish(),
                    $followers,
                ),
            )
            ->finish();
    }
}
