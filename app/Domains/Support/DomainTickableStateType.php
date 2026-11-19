<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\TickableStateLoader;
use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;

/**
 * A domain's ticking state type registered with the domain that owns it: the same as DomainStateType, and still marked
 * as ticking so the engine finds its frames.
 */
final readonly class DomainTickableStateType implements ConditionalStateType, TickableStateLoader
{
    public function __construct(private DomainStateType $type, private TickableStateLoader $loader) {}

    public function statesFor(StateReferences $references): StateSet
    {
        return $this->type->statesFor($references);
    }

    public function schemaVersion(): int
    {
        return $this->type->schemaVersion();
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
