<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Values\TrustedEntryAuthority;

/**
 * The journal itself acts as the system through several trusted entries; each entry may act only on the subjects of
 * the policies SystemEntryPolicies lists for it, and a system actor outside a listed entry may do nothing. Each
 * family of commands adds its policies to the entries that need them.
 */
final readonly class SystemAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(private CurrentActor $actors, private SystemEntryPolicies $entries) {}

    /**
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        $authority = $this->actors->authority();
        $entry = $authority instanceof TrustedEntryAuthority ? $authority->entry : '';

        if (! $this->entries->has($entry)) {
            throw ActorNotAllowed::outsideTrustedEntry($authority->description());
        }

        return new SystemEntryAuthorizer($this->entries->of($entry));
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        throw ActorNotAllowed::withoutStoredAuthority('system');
    }
}
