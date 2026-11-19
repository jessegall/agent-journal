<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Support\DomainEntry;
use App\Numbers\Contracts\NumberedModelRegistration;

/**
 * Registers the models the domain numbers; the registry checks them once every domain has booted.
 */
final readonly class RegisterNumberedModels implements DomainBootstrapper
{
    public function __construct(private NumberedModelRegistration $numbered) {}

    public function __invoke(DomainEntry $domain): void
    {
        $this->numbered->register(...$domain->numberedModels());
    }
}
