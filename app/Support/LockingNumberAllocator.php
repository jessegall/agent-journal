<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CommandTransaction;
use App\Contracts\Numbered;
use App\Exceptions\NumberHolderUnsaved;
use App\Models\NumberGroup;
use Illuminate\Database\Eloquent\Model;

/**
 * Numbers a record inside the running bus command: it locks the holder's row, then the group's, creating a missing
 * group under the holder's lock, and takes the group's next number. It never opens, commits or retries a
 * transaction, and reads the group fresh every time, so a retried command numbers again from the database.
 */
final readonly class LockingNumberAllocator
{
    public function __construct(
        private CommandTransaction $transaction,
        private NumberedTypeRegistry $types,
        private OutsideCommandAllowance $outsideCommands,
    ) {}

    public function allocate(Model&Numbered $record): void
    {
        if (! $this->outsideCommands->isAllowed()) {
            $this->transaction->assertRunning($record->getConnection());
        }

        $this->types->assertNumbered($record->getMorphClass());
        $holder = $record->numberHolder();

        if (! $holder->exists) {
            throw NumberHolderUnsaved::for($record);
        }

        $holder->newQuery()->whereKey($holder->getKey())->lockForUpdate()->sole();
        $group = $this->lockedGroup($holder, $record->getMorphClass());
        $record->assignNumber($group->id, $group->takeNumber());
    }

    private function lockedGroup(Model $holder, string $recordType): NumberGroup
    {
        $key = [$holder->getMorphClass(), (string) $holder->getKey(), $recordType];

        $group = NumberGroup::query()->forRecords(...$key)->locked()->first();

        if ($group !== null) {
            return $group;
        }

        NumberGroup::create($key[0], $key[1], $recordType);

        return NumberGroup::query()->forRecords(...$key)->locked()->sole();
    }
}
