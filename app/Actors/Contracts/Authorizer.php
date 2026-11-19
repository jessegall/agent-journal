<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActorNotAllowed;
use BackedEnum;

/**
 * How one actor's profile decides whether it may do an ability on a subject: it returns normally when the actor may,
 * and throws when it may not. It never answers a yes or no for the caller to act on.
 */
interface Authorizer
{
    /**
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function authorize(Policy $policy, Actor $actor, object|string $subject, BackedEnum $ability): void;
}
