<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorTypes;
use App\Contracts\Actors\StoredActor;
use App\Contracts\Authorization\AuthorizerProvider;
use App\Contracts\Authorization\AuthorizerProviderRegistration as AuthorizerProviderRegistrationContract;
use App\Exceptions\AuthorizerProviderMissing;
use App\Exceptions\AuthorizerProviderRepeated;
use Illuminate\Container\Container;

/**
 * The authorizer provider of each actor type, registered once at boot; a provider is built per call, so nothing it
 * holds outlives the request. Every actor type has one once the application booted.
 */
final class AuthorizerProviderRegistration implements AuthorizerProviderRegistrationContract
{
    /**
     * @var Registry<class-string<AuthorizerProvider>>
     */
    private readonly Registry $providers;

    public function __construct()
    {
        $this->providers = Registry::once(
            AuthorizerProviderMissing::forType(...),
            AuthorizerProviderRepeated::forType(...),
        );
    }

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<AuthorizerProvider>  $class
     */
    public function register(string $actorClass, string $class): void
    {
        $this->providers->put($actorClass::storedType(), $class);
    }

    /**
     * @throws AuthorizerProviderMissing
     */
    public function get(string $type): AuthorizerProvider
    {
        // The registry outlives a request under Octane; the provider comes from the request's own container, so it
        // reads that request's actor, never the one of the request that booted the registry.
        return Container::getInstance()->make($this->providers->get($type));
    }

    /**
     * Refuses a boot that left an actor type without a provider.
     *
     * @throws AuthorizerProviderMissing
     */
    public function requireEveryType(ActorTypes $types): void
    {
        foreach ($types->types() as $type) {
            $this->providers->get($type);
        }
    }
}
