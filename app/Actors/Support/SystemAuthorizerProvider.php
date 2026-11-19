<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\Policy;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Values\TrustedEntryAuthority;

/**
 * The journal itself acts as the system through several trusted entries; each entry may act only on the subjects of
 * the policies listed for it here, as plain data, and a system actor outside a listed entry may do nothing. Each
 * family of commands adds its policies to the entries that need them.
 */
final readonly class SystemAuthorizerProvider implements AuthorizerProvider
{
    /**
     * @var array<string, list<class-string<Policy>>>
     */
    private const array ENTRIES = [
        'host request' => [],
        'host enrolment' => [],
        'process reconcile' => [],
        'share read' => [],
        'sharing supervisor' => [],
        'skill publishing' => [],
        'skill refresh' => [],
        'built-in profiles' => [],
    ];

    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws ActorNotAllowed
     */
    public function forActor(Actor $actor): Authorizer
    {
        $authority = $this->actors->authority();
        $entry = $authority instanceof TrustedEntryAuthority ? $authority->entry : '';

        if (! array_key_exists($entry, self::ENTRIES)) {
            throw ActorNotAllowed::outsideTrustedEntry($authority->description());
        }

        return new SystemEntryAuthorizer(self::ENTRIES[$entry]);
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        throw ActorNotAllowed::withoutStoredAuthority('system');
    }
}
