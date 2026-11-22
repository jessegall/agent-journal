<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\DetailPage;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Http\Requests\SequenceRunRequest;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One sequence run for the one who may read it: its name and state, and its steps in order as a timeline. While the run
 * is running its current step is marked and the steps before it are done; a finished or cancelled run shows its steps
 * with its terminal state and no current step. A run the reader may not read is not found.
 */
final readonly class SequenceRunWindowResolver implements PageResolver
{
    public function __construct(
        private SequenceRunRequest $request,
        private SequenceRecords $runs,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $run = $this->runs->get($this->request->runId());
        } catch (SequenceRunMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        $isRunning = $run->state === SequenceRunState::Running;
        $steps = [];

        foreach ($run->steps as $index => $title) {
            $position = $index + 1;
            $isCurrent = $isRunning && $position === $run->current_step;

            $steps[] = new LayoutRowData(
                (string) $position,
                $title,
                isCurrent: $isCurrent,
                leading: [LayoutPartData::text('position', (string) $position, 'muted')],
                trailing: [$this->markOf($position, $run->current_step, $run->state)],
            );
        }

        return DetailPage::make($run->name)
            ->above(LayoutPartData::text('label', "sequence run {$run->number}", 'code'))
            ->withFacts(new LayoutRowData('state', 'State', ucfirst($run->state->value)))
            ->withStanding(LayoutPartData::collection('steps', 'list', $steps))
            ->layout();
    }

    private function markOf(int $position, int $current, SequenceRunState $state): LayoutPartData
    {
        if ($state !== SequenceRunState::Running) {
            return LayoutPartData::text('mark', $state === SequenceRunState::Finished ? 'Done' : 'Not done', 'muted');
        }

        return match (true) {
            $position === $current => LayoutPartData::text('mark', 'Current', 'chip'),
            $position < $current => LayoutPartData::text('mark', 'Done', 'muted'),
            default => LayoutPartData::text('mark', 'Waiting', 'muted'),
        };
    }
}
