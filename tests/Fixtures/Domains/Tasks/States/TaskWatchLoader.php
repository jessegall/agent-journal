<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\References\StateReference;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Support\References\SubjectReference;
use App\Enums\SessionTransferType;
use App\Exceptions\StateSubjectMissing;

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
