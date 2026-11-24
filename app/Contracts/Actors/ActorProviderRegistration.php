<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Contracts\Work\ActorStackSessionProvider;
use App\Enums\ActorType;
use App\Exceptions\ActorProviderRepeated;

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

    /**
     * @param  class-string<ActorLabelProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function registerLabels(ActorType $type, string $providerClass): void;

    /**
     * @param  class-string<ActorVisibilityProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function registerVisibility(ActorType $type, string $providerClass): void;

    /**
     * @param  class-string<ActorStackSessionProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function registerStackSessions(ActorType $type, string $providerClass): void;
}
