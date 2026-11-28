<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Bootstrap\Attributes\Rules\RequiresInterface;
use App\Contracts\Domains\DomainBootstrapper;
use App\Records\Contracts\StateProvider;
use App\Support\Bootstrappers\StatesBootstrapper;

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
        return [StatesBootstrapper::class];
    }
}
