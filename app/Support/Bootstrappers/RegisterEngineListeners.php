<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Contracts\Events\EngineListenerProvider;
use App\Support\DomainEntry;
use App\Support\EngineListenerSet;

/**
 * Adds the engine listeners a domain declares to every engine pass, beside Core's own.
 */
final readonly class RegisterEngineListeners implements DomainBootstrapper
{
    public function __construct(private EngineListenerSet $listeners) {}

    public function __invoke(DomainEntry $domain): void
    {
        if (! $domain->domain instanceof EngineListenerProvider) {
            return;
        }

        foreach ($domain->domain->engineListeners() as $listener) {
            $this->listeners->add($listener);
        }
    }
}
