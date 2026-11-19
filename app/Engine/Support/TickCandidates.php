<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Engine\Values\ScanProgress;
use App\Engine\Values\TickBatch;
use App\Engine\Values\TickCandidate;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\ResolvesStateTypes;
use App\Hooks\Contracts\TickableState;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Exceptions\StateSchemaUnknown;
use App\Hooks\Exceptions\TickableStateMissing;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\States\AgentState;
use App\Hooks\Values\WorkOccurrence;
use App\Reads\Support\ScopedReadMeter;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Selects the ticking frames of a pass: open stacks that hold one, in stack and frame order from where the last pass
 * stopped, up to a limit, and restores only their ticking states, at most 100 references per type per read. Finished
 * frames and the frames of a switched-off type are skipped and stay stored. The scan progress lives as long as the engine process.
 */
final class TickCandidates
{
    private ScanProgress $progress;

    public function __construct(private readonly ResolvesStateTypes $types)
    {
        $this->progress = ScanProgress::start();
    }

    /**
     * The next ticking frames of this pass, up to the limit; once every ticking stack has been examined the next call
     * starts a new pass. Progress counts the positions examined, not the live candidates found.
     */
    public function next(int $limit): TickBatch
    {
        $selected = $this->examineAfter($this->progress, $limit);
        $restored = ScopedReadMeter::ofCurrentScope()->withinSchedule('engine ticks', fn () => $this->restore($selected));

        return new TickBatch($restored);
    }

    /**
     * Has the next pass begin at this candidate, which this pass had no time left for, anchored on its frame.
     */
    public function startNextPassAt(TickCandidate $candidate): void
    {
        $this->progress = $this->progress->resumeAt($candidate);
    }

    /**
     * The candidate as it stands now, read again in full because an earlier command may have changed any stack: none
     * when its frame is gone or its work is done, otherwise at its real current position.
     *
     * @return Option<TickCandidate>
     */
    public function refresh(TickCandidate $candidate): Option
    {
        $row = AgentStackRow::query()->authorizedFor($candidate->target)->first();

        if ($row === null || ! $row->isActive()) {
            return None::create();
        }

        foreach ($row->frames->all() as $position => $record) {
            if ($record->id === $candidate->frameId) {
                $restored = $this->restore([new SelectedFrame($row, $record, $position)]);

                return $restored === [] ? None::create() : new Some($restored[0]);
            }
        }

        return None::create();
    }

    /**
     * The ticking frames after the progress, up to the limit, moving the progress past every position examined; when
     * no stack is left the progress starts a new pass.
     *
     * @return list<SelectedFrame>
     */
    private function examineAfter(ScanProgress $progress, int $limit): array
    {
        $ticking = $this->types->ticking();
        $rows = AgentStackRow::query()->tickingOpen()->where('id', '>=', $progress->stackId)->orderBy('id')
            ->readLimit($limit)->get();
        $selected = [];
        $last = $progress;

        foreach ($rows as $row) {
            foreach ($row->frames->all() as $position => $record) {
                if (count($selected) === $limit) {
                    $this->progress = $last;

                    return $selected;
                }

                if (! $progress->isAhead($row->id, $row->version, $position, $record->id)) {
                    continue;
                }

                $isTicking = $ticking->contains($record->reference->typeKey);
                $delivered = $isTicking ? [$record->id] : [];
                $last = $last->after($row->id, $row->version, $position, $record->id, $delivered);

                if ($isTicking) {
                    $selected[] = new SelectedFrame($row, $record, $position);
                }
            }
        }

        $this->progress = $rows->count() < $limit ? ScanProgress::start() : $last;

        return $selected;
    }

    /**
     * Restores the selected frames by type, in batches of at most 100 references, keeping stack and frame order.
     *
     * @param  list<SelectedFrame>  $selected
     * @return list<TickCandidate>
     */
    private function restore(array $selected): array
    {
        $byType = [];

        foreach ($selected as $index => $frame) {
            $byType[$frame->record->reference->typeKey][] = $index;
        }

        $candidates = [];

        foreach ($byType as $typeKey => $indexes) {
            $type = $this->types->registry()->get($typeKey);

            if ($type instanceof ConditionalStateType && ! $type->isEnabled()) {
                continue;
            }

            foreach (array_chunk($indexes, StateReferences::MAXIMUM) as $batch) {
                $states = $type->statesFor(new StateReferences(array_map(fn (int $index) => $selected[$index]->record->reference, $batch)));

                foreach ($batch as $position => $index) {
                    $frame = $selected[$index];

                    if ($frame->record->schemaVersion !== $type->schemaVersion()) {
                        throw StateSchemaUnknown::for($frame->record->description(), $type->schemaVersion());
                    }

                    $state = $states->stateAt($position);

                    if (! $state->isFinished()) {
                        $candidates[$index] = $this->candidate($frame, $state);
                    }
                }
            }
        }

        ksort($candidates);

        return array_values($candidates);
    }

    private function candidate(SelectedFrame $frame, AgentState $state): TickCandidate
    {
        if (! $state instanceof TickableState) {
            throw TickableStateMissing::forType($frame->typeKey(), $state::class);
        }

        return new TickCandidate(
            $frame->row->target(),
            $frame->row->id,
            $frame->row->version,
            $frame->record->id,
            $frame->position,
            $frame->record->enteredAt,
            $state,
            WorkOccurrence::of($frame->record->reference),
        );
    }
}
