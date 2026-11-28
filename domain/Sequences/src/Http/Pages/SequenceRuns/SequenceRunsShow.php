<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\SequenceRuns;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Models\SequenceRun;

/**
 * One sequence run's page: its name and state, and its steps in order as a timeline. While the run is running its
 * current step is marked and the steps before it are done; a finished or cancelled run shows its steps with its
 * terminal state and no current step.
 */
final readonly class SequenceRunsShow extends SequenceRunsPage
{
    public function of(SequenceRun $run): DeclaredLayoutData
    {
        return $this->detailOf($run)->layout();
    }

    /**
     * The run's reader, to stand beside the runs list.
     */
    public function part(SequenceRun $run): LayoutPartData
    {
        return $this->detailOf($run)->part();
    }

    private function detailOf(SequenceRun $run): DetailPage
    {
        $isRunning = $run->status === SequenceRunStatus::Running;
        $steps = [];

        foreach ($run->steps as $index => $title) {
            $position = $index + 1;
            $isCurrent = $isRunning && $position === $run->current_step;

            $steps[] = LayoutRowData::build()
                ->key((string) $position)
                ->label($title)
                ->isCurrent($isCurrent)
                ->leading(
                    [LayoutPartData::build()
                    ->asText()
                    ->key('position')
                    ->value((string) $position)
                    ->style('muted')
                    ->finish()],
                )
                ->trailing([$this->markOf($position, $run->current_step, $run->status)])
                ->finish();
        }

        return DetailPage::build()->title($run->name)->finish()
            ->above(LayoutPartData::build()
                ->asText()
                ->key('label')
                ->value("sequence run {$run->number}")
                ->style('code')
                ->finish())
            ->withFacts(LayoutRowData::build()
                ->key('state')
                ->label('State')
                ->value(ucfirst($run->status->value))
                ->finish())
            ->withStanding(LayoutPartData::build()
                ->asCollection()
                ->key('steps')
                ->style('list')
                ->rows($steps)
                ->finish());
    }

    private function markOf(int $position, int $current, SequenceRunStatus $status): LayoutPartData
    {
        if ($status !== SequenceRunStatus::Running) {
            return LayoutPartData::build()
                ->asText()
                ->key('mark')
                ->value($status === SequenceRunStatus::Finished ? 'Done' : 'Not done')
                ->style('muted')
                ->finish();
        }

        return match (true) {
            $position === $current => LayoutPartData::build()
                ->asText()
                ->key('mark')
                ->value('Current')
                ->style('chip')
                ->finish(),
            $position < $current => LayoutPartData::build()
                ->asText()
                ->key('mark')
                ->value('Done')
                ->style('muted')
                ->finish(),
            default => LayoutPartData::build()->asText()->key('mark')->value('Waiting')->style('muted')->finish(),
        };
    }
}
