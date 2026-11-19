<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\AuthorizerProviderRepeated;

/**
 * Where the owner of an actor type registers the provider of its authorizers, once, at boot.
 */
interface AuthorizerProviderRegistration
{
    /**
     * @param  class-string<AuthorizerProvider>  $providerClass
     *
     * @throws AuthorizerProviderRepeated
     */
    public function register(ActorType $type, string $providerClass): void;
}
