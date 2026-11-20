<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\UnrestrictedAuthorizer;
use App\Engine\Exceptions\EngineAccessRefused;

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
        $this->access->requireGranted();

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
