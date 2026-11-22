<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\Authorizer;
use App\Contracts\AuthorizerProvider;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\EngineAccessRefused;

/**
 * The engine's authorizer: it acts only under the frame or maintenance grant the engine pass gave it, and the commands
 * it runs check that grant against their target; with no grant it may do nothing.
 */
final readonly class EngineAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(private EngineAccess $access) {}

    /**
     * @throws EngineAccessRefused
     */
    public function forActor(Actor $actor): Authorizer
    {
        $this->access->assertGranted();

        return new UnrestrictedAuthorizer();
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        throw ActorNotAllowed::withoutStoredAuthority('engine');
    }
}
