<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Exceptions\InvalidBottomState;
use App\Hooks\States\ReadyState;
use App\Hooks\Ticks\TickingTypes;

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

        if ($first->reference->typeKey !== ReadyState::TYPE_KEY) {
            throw InvalidBottomState::ofAnotherRole($first->reference->typeKey, ReadyState::TYPE_KEY);
        }

        foreach (array_slice($this->records, 1) as $record) {
            if ($record->isBottom) {
                throw InvalidBottomState::repeated($record->id);
            }
        }
    }
}
