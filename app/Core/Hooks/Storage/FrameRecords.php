<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\Enums\ReadyStateType;
use App\Core\Hooks\Exceptions\InvalidBottomState;

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
