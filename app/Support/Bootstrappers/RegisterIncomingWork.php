<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Stacks\Contracts\Work\IncomingWorkRegistration;
use App\Support\DomainEntry;

/**
 * Hands a domain's incoming work to the hooks, in the order the domain declares it.
 */
final readonly class RegisterIncomingWork implements DomainBootstrapper
{
    public function __construct(private IncomingWorkRegistration $incoming) {}

    public function __invoke(DomainEntry $domain): void
    {
        foreach ($domain->incomingWork() as $workClass) {
            $this->incoming->register($workClass);
        }
    }
}
