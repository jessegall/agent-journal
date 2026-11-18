<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Agents\Support\StackTarget;
use App\Engine\Values\TickBatch;
use App\Engine\Values\TickCandidate;
use App\Engine\Values\TickCursor;
use App\Hooks\Contracts\TickableState;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Exceptions\StateSchemaUnknown;
use App\Hooks\Exceptions\TickableStateMissing;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\AgentState;
use App\Reads\Support\ScopedReadMeter;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Selects the ticking frames of a pass: open stacks that hold one, in stack and frame order from where the last pass
 * stopped, up to a limit, and restores only their ticking states, at most 100 references per type per read. Finished
 * frames are skipped and stay stored. The cursor lives as long as the engine process.
 */
final class TickCandidates
{
    private TickCursor $cursor;

    public function __construct(private readonly StateTypes $types)
    {
        $this->cursor = TickCursor::start();
    }

    public function next(int $limit): TickBatch
    {
        $selected = $this->selectAfter($this->cursor, $limit);
        $this->cursor = count($selected) < $limit ? TickCursor::start() : $this->cursorAfter($selected);

        return new TickBatch(ScopedReadMeter::ofCurrentScope()->withinSchedule('engine ticks', fn () => $this->restore($selected)));
    }

    /**
     * Sends the cursor back so the next pass starts at this candidate, which this pass had no time left for.
     */
    public function startNextPassAt(TickCandidate $candidate): void
    {
        $this->cursor = TickCursor::after($candidate->stackId, $candidate->position - 1);
    }

    /**
     * The candidate as it stands now, after a preceding command may have changed its stack: none when its frame is
     * gone or its work is done.
     *
     * @return Option<TickCandidate>
     */
    public function refresh(TickCandidate $candidate): Option
    {
        $row = AgentStackRow::query()->authorizedFor($candidate->target)->first();

        if ($row === null || ! $row->isActive()) {
            return None::create();
        }

        if ($row->version === $candidate->stackVersion) {
            return new Some($candidate);
        }

        foreach ($row->frames->all() as $record) {
            if ($record->id === $candidate->frameId) {
                $restored = $this->restore([new SelectedFrame($row, $record)]);

                return $restored === [] ? None::create() : new Some($restored[0]);
            }
        }

        return None::create();
    }

    /**
     * @return list<SelectedFrame>
     */
    private function selectAfter(TickCursor $cursor, int $limit): array
    {
        $ticking = $this->types->ticking();
        $rows = AgentStackRow::query()->tickingOpen()->where('id', '>=', $cursor->stackId)->orderBy('id')->readLimit($limit)->get();
        $selected = [];

        foreach ($rows as $row) {
            foreach ($row->frames->all() as $position => $record) {
                if (count($selected) === $limit) {
                    return $selected;
                }

                if ($ticking->contains($record->reference->typeKey) && $cursor->precedes($row->id, $position)) {
                    $selected[] = new SelectedFrame($row, $record, $position);
                }
            }
        }

        return $selected;
    }

    /**
     * @param  list<SelectedFrame>  $selected
     */
    private function cursorAfter(array $selected): TickCursor
    {
        $last = end($selected);

        if ($last === false) {
            return TickCursor::start();
        }

        return TickCursor::after($last->row->id, $last->position);
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
            throw TickableStateMissing::forType($frame->record->reference->typeKey, $state::class);
        }

        return new TickCandidate(
            new StackTarget($frame->row->agent_id, $frame->row->session_id),
            $frame->row->id,
            $frame->row->version,
            $frame->record->id,
            $frame->position,
            $frame->record->enteredAt,
            $state,
        );
    }
}
