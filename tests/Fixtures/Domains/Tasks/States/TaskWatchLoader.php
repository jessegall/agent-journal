<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSubjectMissing;

/**
 * Restores a watch from the task id and watch number stored in its frame.
 */
class TaskWatchLoader implements StateLoader
{
    /**
     * @return class-string<TaskWatchState>
     */
    public function stateClass(): string
    {
        return TaskWatchState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $class = $this->stateClass();

        return StateSet::build($references, static function (StateReference $reference) use ($class): TaskWatchState {
            if (! $reference->subject instanceof SubjectReference) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            return new $class($reference->subject);
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
