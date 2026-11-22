<?php

declare(strict_types=1);

namespace App\Skills\States\Support;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;
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

        return StateSet::forSubjects($references, $states, fn ($state) => new AwaitingSkillsState($state));
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
