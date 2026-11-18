<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorProviderRepeated;

/**
 * Where the owner of an actor type registers the provider that finds its actors, once, at boot.
 */
interface ActorProviderRegistration
{
    /**
     * @param  class-string<ActorProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function register(ActorType $type, string $providerClass): void;
}
