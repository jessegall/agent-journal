<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AuthorizerProvider;
use App\Contracts\AuthorizerProviderRegistration;
use App\Enums\ActorType;
use App\Exceptions\AuthorizerProviderMissing;
use App\Exceptions\AuthorizerProviderRepeated;
use Illuminate\Container\Container;

/**
 * The authorizer provider of each actor type, registered once at boot; a provider is built per call, so nothing it
 * holds outlives the request. Every actor type has one once the application booted.
 */
final class AuthorizerProviderRegistry implements AuthorizerProviderRegistration
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
     * @param  class-string<AuthorizerProvider>  $class
     */
    public function register(ActorType $type, string $class): void
    {
        $this->providers->put($type->value, $class);
    }

    /**
     * @throws AuthorizerProviderMissing
     */
    public function get(ActorType $type): AuthorizerProvider
    {
        // The registry outlives a request under Octane; the provider comes from the request's own container, so it
        // reads that request's actor, never the one of the request that booted the registry.
        return Container::getInstance()->make($this->providers->get($type->value));
    }

    /**
     * Refuses a boot that left an actor type without a provider.
     *
     * @throws AuthorizerProviderMissing
     */
    public function requireEveryType(): void
    {
        foreach (ActorType::cases() as $type) {
            $this->providers->get($type->value);
        }
    }
}
