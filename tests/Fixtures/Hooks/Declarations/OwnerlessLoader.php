<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Declarations;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Enums\SessionTransferType;

/**
 * Loads the ownerless fixture state.
 */
final class OwnerlessLoader implements StateLoader
{
    /**
     * @return class-string<OwnerlessState>
     */
    public function stateClass(): string
    {
        return OwnerlessState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, static fn () => new OwnerlessState());
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
