<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Contracts\DomainAvailability;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use Closure;

/**
 * A domain's state type registered with the domain that owns it: it loads states exactly as the domain's own loader
 * does, and is enabled only while that domain is available, asked anew each time.
 */
final readonly class DomainStateType implements ConditionalStateType, StateLoader
{
    /**
     * @param  Closure(): DomainAvailability  $availability  resolves the availability of the request running now
     */
    public function __construct(public string $owner, private StateLoader $loader, private Closure $availability) {}

    public function statesFor(StateReferences $references): StateSet
    {
        return $this->loader->statesFor($references);
    }

    public function schemaVersion(): int
    {
        return $this->loader->schemaVersion();
    }

    public function isEnabled(): bool
    {
        return ($this->availability)()->isEnabled($this->owner);
    }
}
