<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

/**
 * A domain that runs steps as the application boots, in the order it lists them.
 */
interface ProvidesBootstrappers
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    public function bootstrappers(): array;
}
