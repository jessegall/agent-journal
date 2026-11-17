<?php

declare(strict_types=1);

namespace App\Core\Actors\Contracts;

use App\Core\Actors\Support\ActorStore;
use Illuminate\Container\Attributes\Bind;

/**
 * Makes an authenticated actor the one of this request, and forgets it again when the request ends. Only the
 * authenticating middleware use this, after their own credential or access checks passed.
 */
#[Bind(ActorStore::class)]
interface CurrentActorSetter
{
    public function set(Actor $actor): void;

    public function clear(): void;
}
