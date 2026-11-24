<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Attributes\RequiresInterface;
use App\Contracts\Domains\DomainBootstrapper;
use App\Contracts\Records\StateProvider;
use App\Support\Bootstrappers\RegisterStates;

/**
 * Boots the agent states a domain declares through its capability interface.
 */
#[RequiresInterface(StateProvider::class)]
trait HasStates
{
    /**
     * @return list<class-string<DomainBootstrapper>>
     */
    protected function bootstrappersHasStates(): array
    {
        return [RegisterStates::class];
    }
}
