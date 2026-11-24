<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\Authorizer;
use App\Contracts\Authorization\AuthorizerProvider;
use App\Exceptions\ActorNotAllowed;
use App\Values\TrustedEntryAuthority;

/**
 * The journal itself acts as the system through several trusted entries; each entry may act only on the subjects of
 * the policies SystemEntryPolicies lists for it, and a system actor outside a listed entry may do nothing. Each
 * family of commands adds its policies to the entries that need them.
 */
final readonly class SystemAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(
        private CurrentActor $actors,
        private SystemEntryPolicies $systemPolicies,
        private EngineAccess $engine,
    ) {}

    /**
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        if ($this->engine->isGranted()) {
            return new UnrestrictedAuthorizer();
        }

        $authority = $this->actors->authority();
        $entry = $authority instanceof TrustedEntryAuthority ? $authority->entry : '';

        if (! $this->systemPolicies->has($entry)) {
            throw ActorNotAllowed::outsideTrustedEntry($authority->description());
        }

        return new SystemEntryAuthorizer($this->systemPolicies->of($entry));
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        throw ActorNotAllowed::withoutStoredAuthority('system');
    }
}
