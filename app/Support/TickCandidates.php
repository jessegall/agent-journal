<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\TickableState;
use App\Exceptions\StateSchemaUnknown;
use App\Exceptions\TickableStateMissing;
use App\Models\Agents\AgentStackRow;
use App\Support\References\WorkOccurrence;
use App\Support\StateCatalog\Contracts\StateTypes;
use App\Support\StateLoading\StateBuilder;
use App\Support\States\AgentState;
use App\Values\ScanProgress;
use App\Values\TickBatch;
use App\Values\TickCandidate;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Selects the ticking frames of a pass: open stacks that hold one, in stack and frame order from where the last pass
 * stopped, up to a limit, and builds only their ticking states from their saved values. Finished
 * frames and the frames of a switched-off type are skipped and stay stored. The scan progress lives as long as the
 * engine process.
 */
final class TickCandidates
{
    private ScanProgress $progress;

    public function __construct(
        private readonly StateTypes $types,
        private readonly StateBuilder $builder,
    ) {
        $this->progress = ScanProgress::start();
    }

    /**
     * The next ticking frames of this pass, up to the limit; once every ticking stack has been examined the next call
     * starts a new pass. Progress counts the positions examined, not the live candidates found.
     */
    public function next(int $limit): TickBatch
    {
        $selected = $this->examineAfter($this->progress, $limit);

        $restored = ScopedReadMeter::ofCurrentScope()->withinSchedule(
            'engine ticks',
            fn () => $this->restore($selected),
        );

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
            ->readExactly($limit)->get();

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
     * Builds the state of each selected frame from its saved values, keeping stack and frame order; a frame whose
     * type is switched off or whose work is finished is no candidate.
     *
     * @param  list<SelectedFrame>  $selected
     * @return list<TickCandidate>
     */
    private function restore(array $selected): array
    {
        $candidates = [];

        foreach ($selected as $frame) {
            $type = $this->types->registry()->get($frame->typeKey());

            if (! $type->isEnabled()) {
                continue;
            }

            if ($frame->record->schemaVersion !== $type->schemaVersion) {
                throw StateSchemaUnknown::for($frame->record->description(), $type->schemaVersion);
            }

            $state = $this->builder->build($type, $frame->record->values);

            if (! $state->isFinished()) {
                $candidates[] = $this->candidate($frame, $state);
            }
        }

        return $candidates;
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
