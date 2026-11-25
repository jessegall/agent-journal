<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Contracts\Work\ActorStackSessionProvider;
use App\Exceptions\ActorProviderRepeated;

/**
 * Where the owner of a kind of actor registers its class and the providers that find its actors, once, at boot.
 */
interface ActorProviderRegistration
{
    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function register(string $actorClass, string $providerClass): void;

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorLabelProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function registerLabels(string $actorClass, string $providerClass): void;

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorVisibilityProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function registerVisibility(string $actorClass, string $providerClass): void;

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorStackSessionProvider>  $providerClass
     *
     * @throws ActorProviderRepeated
     */
    public function registerStackSessions(string $actorClass, string $providerClass): void;
}
