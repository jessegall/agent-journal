<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\AuthorizerProviderMissing;
use App\Actors\Exceptions\AuthorizerProviderRepeated;
use Illuminate\Container\Container;

/**
 * The authorizer provider of each actor type, registered once at boot; a provider is built per call, so nothing it
 * holds outlives the request. Every actor type has one once the application booted.
 */
final class AuthorizerProviderRegistry implements AuthorizerProviderRegistration
{
    /**
     * @var array<string, class-string<AuthorizerProvider>>
     */
    private array $providers = [];

    /**
     * @param  class-string<AuthorizerProvider>  $providerClass
     */
    public function register(ActorType $type, string $providerClass): void
    {
        if (array_key_exists($type->value, $this->providers)) {
            throw AuthorizerProviderRepeated::forType($type->value);
        }

        $this->providers[$type->value] = $providerClass;
    }

    /**
     * @throws AuthorizerProviderMissing
     */
    public function get(ActorType $type): AuthorizerProvider
    {
        $providerClass = $this->providers[$type->value] ?? throw AuthorizerProviderMissing::forType($type->value);

        // The registry outlives a request under Octane; the provider comes from the request's own container, so it
        // reads
        // that request's actor, never the one of the request that booted the registry.
        return Container::getInstance()->make($providerClass);
    }

    /**
     * Refuses a boot that left an actor type without a provider.
     *
     * @throws AuthorizerProviderMissing
     */
    public function requireEveryType(): void
    {
        foreach (ActorType::cases() as $type) {
            if (! array_key_exists($type->value, $this->providers)) {
                throw AuthorizerProviderMissing::forType($type->value);
            }
        }
    }
}
