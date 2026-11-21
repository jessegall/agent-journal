<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Actors\Support\ActorIdentity;
use App\Contracts\DomainAvailability;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\StateLoading\Contracts\RecipientStateLoader;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;
use Closure;

/**
 * A domain's state type registered with the domain that owns it: it loads states exactly as the domain's own loader
 * does, and is enabled only while that domain is available, asked anew each time.
 */
final readonly class DomainStateType implements ConditionalStateType, RecipientStateLoader
{
    /**
     * @param  Closure(): DomainAvailability  $availability  resolves the availability of the request running now
     */
    public function __construct(public string $owner, private StateLoader $loader, private Closure $availability) {}

    public function stateClass(): string
    {
        return $this->loader->stateClass();
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return $this->loader->statesFor($references);
    }

    /**
     * Reads for the stack's own actor when the domain's loader depends on it, else as statesFor does.
     */
    public function statesForRecipient(StateReferences $references, ActorIdentity $recipient): StateSet
    {
        if ($this->loader instanceof RecipientStateLoader) {
            return $this->loader->statesForRecipient($references, $recipient);
        }

        return $this->loader->statesFor($references);
    }

    public function schemaVersion(): int
    {
        return $this->loader->schemaVersion();
    }

    public function sessionTransfer(): SessionTransferType
    {
        return $this->loader->sessionTransfer();
    }

    public function isEnabled(): bool
    {
        return ($this->availability)()->isEnabled($this->owner);
    }
}
