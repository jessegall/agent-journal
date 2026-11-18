<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Exceptions\InvalidBottomState;
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
     * The role the bottom frame stands for.
     *
     * @throws InvalidBottomState when the stack has no ready frame at its bottom
     */
    public function role(): ReadyStateType
    {
        $first = $this->records[0] ?? throw InvalidBottomState::missing();

        return ReadyStateType::tryFrom($first->reference->typeKey) ?? throw InvalidBottomState::missing();
    }

    /**
     * @throws InvalidBottomState unless the first frame, and only the first, is the bottom state of the role
     */
    public function checkBottomFor(ReadyStateType $role): void
    {
        $first = $this->records[0] ?? null;

        if ($first === null || ! $first->isBottom) {
            throw InvalidBottomState::missing();
        }

        if ($first->reference->typeKey !== $role->value) {
            throw InvalidBottomState::ofAnotherRole($first->reference->typeKey, $role->value);
        }

        foreach (array_slice($this->records, 1) as $record) {
            if ($record->isBottom) {
                throw InvalidBottomState::repeated($record->id);
            }
        }
    }
}
