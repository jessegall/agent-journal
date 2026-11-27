<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Exceptions\InvalidBottomState;
use App\Sessions\States\Support\ReadyStateReference;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Support\Ticks\TickingTypes;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;

/**
 * The frames of one stack as they are stored, bottom first.
 */
final readonly class FrameRecords
{
    /**
     * @param  list<FrameRecord>  $records
     */
    public function __construct(private array $records) {}

    /**
     * @return list<FrameRecord>
     */
    public function all(): array
    {
        return $this->records;
    }

    public function entryFor(WorkReference $work): CarbonImmutable|null
    {
        $entered = null;

        foreach ($this->records as $frame) {
            if (! $frame->reference->isForWork($work)) {
                continue;
            }

            if ($entered === null || $frame->enteredAt->lessThan($entered)) {
                $entered = $frame->enteredAt;
            }
        }

        return $entered;
    }

    /**
     * Whether every frame holds the same state values as its counterpart in the other list, frame for frame.
     */
    public function hasSameValuesAs(self $other): bool
    {
        $others = $other->all();

        if (count($others) !== count($this->records)) {
            return false;
        }

        return array_all(
            $this->records,
            fn (FrameRecord $record, int $position) => $record->hasSameValuesAs($others[$position]),
        );
    }

    /**
     * Whether a frame of one of the state types is among them.
     *
     * @param  list<string>  $typeKeys
     */
    public function holdAnyOf(array $typeKeys): bool
    {
        return array_any(
            $this->records,
            fn (FrameRecord $record) => in_array($record->reference->typeKey, $typeKeys, true),
        );
    }

    /**
     * Whether a frame of a ticking state type is among these frames.
     */
    public function holdTicking(TickingTypes $ticking): bool
    {
        foreach ($this->records as $record) {
            if ($ticking->contains($record->reference->typeKey)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @throws InvalidBottomState unless the first frame, and only the first, is the ready bottom state
     */
    public function checkBottom(): void
    {
        $first = $this->records[0] ?? null;

        if ($first === null || ! $first->isBottom) {
            throw InvalidBottomState::missing();
        }

        if ($first->reference->typeKey !== StateReferenceKeys::of(ReadyStateReference::class)) {
            throw InvalidBottomState::ofAnotherType($first->reference->typeKey);
        }

        foreach (array_slice($this->records, 1) as $record) {
            if ($record->isBottom) {
                throw InvalidBottomState::repeated($record->id);
            }
        }
    }
}
