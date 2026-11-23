<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\SequenceRuns;

use App\Contracts\Actors\ActorLabels;
use App\Support\ActorIdentity;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Http\Pages\SequencePageViews;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Values\SequenceRunPage;

/**
 * The runs list: one actor's runs, newest first and numbered by page, with the actors to choose from above them and
 * the chosen run's reader beside them.
 */
final readonly class SequenceRunsIndex
{
    private const string EMPTY_TEXT = 'No sequence runs for this actor.';

    public function __construct(private ActorLabels $labels, private SequencePageViews $views) {}

    /**
     * @param  list<ActorIdentity>  $followers
     * @param  list<LayoutPartData>  $reader  the chosen run's reader, none for the list address
     */
    public function of(
        array $followers,
        ActorIdentity $follower,
        SequenceRunPage $runs,
        string $chosenRunId = '',
        array $reader = [],
    ): DeclaredLayoutData {
        $query = ['actor' => $follower->text(), 'page' => $runs->page->number];

        return ListPage::make(
            'Runs',
            array_map(fn (SequenceRun $run) => $this->rowOf($run, $query, $chosenRunId), $runs->runs),
            ListEmpty::informing(self::EMPTY_TEXT),
        )
            ->counting($runs->total)
            ->withViews(...$this->views->of(true))
            ->filteredBy($this->choicesOf($followers, $follower))
            ->paged(ListPaging::numbered($runs->page->number, $runs->lastPage()))
            ->withReader(new LayoutBackData(route('sequences.runs', $query, false), 'Runs'), ...$reader)
            ->layout();
    }

    /**
     * The list when no actor follows a run yet.
     */
    public function none(): DeclaredLayoutData
    {
        return ListPage::make('Runs', [], ListEmpty::informing(self::EMPTY_TEXT))
            ->counting(0)
            ->withViews(...$this->views->of(true))
            ->withReader(new LayoutBackData(route('sequences.runs', [], false), 'Runs'))
            ->layout();
    }

    /**
     * @param  array<string, string|int>  $query
     */
    private function rowOf(SequenceRun $run, array $query, string $chosenRunId): LayoutRowData
    {
        $mark = $run->state === SequenceRunState::Running
            ? LayoutPartData::text('step', $run->stepLine($run->current_step), 'chip')
            : LayoutPartData::badge('state', ucfirst($run->state->value), 'quiet');

        return LayoutRowData::from([
            'key' => $run->id,
            'label' => "Run {$run->number}",
            'detail' => $run->name,
            'href' => route('sequences.run', ['run' => $run->number, ...$query], false),
            'isCurrent' => $run->id === $chosenRunId,
            'trailing' => [$mark],
        ]);
    }

    /**
     * @param  list<ActorIdentity>  $followers
     */
    private function choicesOf(array $followers, ActorIdentity $chosen): LayoutPartData
    {
        $labels = $this->labels->labelsFor($followers);

        return LayoutPartData::collection('actors', 'choices', array_map(
            fn (ActorIdentity $follower) => LayoutRowData::from([
                'key' => $follower->text(),
                'label' => $labels->nameOf($follower) ?? $follower->text(),
                'query' => ['actor' => $follower->text(), 'page' => ''],
                'isCurrent' => $follower->text() === $chosen->text(),
            ]),
            $followers,
        ));
    }
}
