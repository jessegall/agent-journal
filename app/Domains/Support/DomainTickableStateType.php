<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Actors\Support\ActorIdentity;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\StateLoading\Contracts\RecipientStateLoader;
use App\Hooks\StateLoading\Contracts\TickableStateLoader;
use App\Hooks\StateLoading\StateSet;

/**
 * A domain's ticking state type registered with the domain that owns it: the same as DomainStateType, and still marked
 * as ticking so the engine finds its frames.
 */
final readonly class DomainTickableStateType implements ConditionalStateType, RecipientStateLoader, TickableStateLoader
{
    public function __construct(private DomainStateType $type, private TickableStateLoader $loader) {}

    public function stateClass(): string
    {
        return $this->type->stateClass();
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return $this->type->statesFor($references);
    }

    public function statesForRecipient(StateReferences $references, ActorIdentity $recipient): StateSet
    {
        return $this->type->statesForRecipient($references, $recipient);
    }

    public function schemaVersion(): int
    {
        return $this->type->schemaVersion();
    }

    public function sessionTransfer(): SessionTransferType
    {
        return $this->type->sessionTransfer();
    }

    public function isEnabled(): bool
    {
        return $this->type->isEnabled();
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return $this->loader->occurrenceGuard();
    }
}
