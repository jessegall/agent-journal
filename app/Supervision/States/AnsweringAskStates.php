<?php

declare(strict_types=1);

namespace App\Supervision\States;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Supervision\Models\AskHop;

final readonly class AnsweringAskStates implements StateLoader
{
    public function stateClass(): string
    {
        return AnsweringAskState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $active = AskHop::activeIds($references->subjectIds());

        return StateSet::build($references, static function (StateReference $reference) use ($active) {
            $subject = $reference->subject;

            return new AnsweringAskState($subject instanceof SubjectReference && in_array($subject->id, $active, true));
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
