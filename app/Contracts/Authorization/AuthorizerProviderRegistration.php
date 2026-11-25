<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Contracts\Actors\StoredActor;
use App\Exceptions\AuthorizerProviderRepeated;

/**
 * Where the owner of an actor type registers the provider of its authorizers, once, at boot.
 */
interface AuthorizerProviderRegistration
{
    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<AuthorizerProvider>  $providerClass
     *
     * @throws AuthorizerProviderRepeated
     */
    public function register(string $actorClass, string $providerClass): void;
}
