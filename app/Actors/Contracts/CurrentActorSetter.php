<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Support\ActorStore;
use Illuminate\Container\Attributes\Bind;

/**
 * Makes an authenticated actor the one of this request, with the source of its authority, in one step, and forgets
 * both again when the request ends. Only the entry points use this, after their own credential or access checks passed.
 */
#[Bind(ActorStore::class)]
interface CurrentActorSetter
{
    public function set(Actor $actor, AuthoritySource $authority): void;

    public function clear(): void;
}
