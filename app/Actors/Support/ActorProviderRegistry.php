<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorReader;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorProviderRepeated;
use App\Actors\Exceptions\ActorUnavailable;
use Illuminate\Contracts\Container\Container;

/**
 * The actor provider of each actor type, registered once at boot; a provider is built per call, so nothing found
 * outlives the request.
 */
final class ActorProviderRegistry implements ActorProviderRegistration, ActorReader
{
    /**
     * @var array<string, class-string<ActorProvider>>
     */
    private array $providers = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<ActorProvider>  $providerClass
     */
    public function register(ActorType $type, string $providerClass): void
    {
        if (array_key_exists($type->value, $this->providers)) {
            throw ActorProviderRepeated::forType($type->value);
        }

        $this->providers[$type->value] = $providerClass;
    }

    public function get(ActorIdentity $identity): Actor
    {
        $providerClass = $this->providers[$identity->type->value] ?? throw ActorUnavailable::forIdentity($identity);

        return $this->container->make($providerClass)->actor($identity);
    }
}
