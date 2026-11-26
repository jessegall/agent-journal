<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Access\Contracts\AuthoritySource;

/**
 * Makes an authenticated actor the one of this request, with the source of its authority, in one step, and forgets
 * both again when the request ends. Only the entry points use this, after their own credential or access checks passed.
 */
interface CurrentActorSetter
{
    /**
     * Makes the actor, and the authority it acts under, the one the running request or job acts for.
     */
    public function set(Actor $actor, AuthoritySource $authority): void;

    /**
     * Forgets the actor once the request or job that acted for it ends.
     */
    public function clear(): void;
}
