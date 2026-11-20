<?php

declare(strict_types=1);

namespace App\Skills\States\Support;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use App\Skills\Models\SkillPublication;
use App\Skills\States\AwaitingSkillsState;

/**
 * Builds the awaiting-skills state from the publication as it is now; it keeps nothing between calls.
 */
final readonly class AwaitingSkillsStateFactory implements StateLoader
{
    public function stateClass(): string
    {
        return AwaitingSkillsState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $states = SkillPublication::statesOf($references->subjectIds());

        return StateSet::build($references, function (StateReference $reference) use ($states): AgentState {
            $subject = $reference->subject;

            if (! $subject instanceof SubjectReference || ! isset($states[$subject->id])) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            return new AwaitingSkillsState($states[$subject->id]);
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
