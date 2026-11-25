<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Contracts\Actors\Actor;
use App\Enums\Agents\AccessType;
use App\Exceptions\GrantNotRegistered;
use Illuminate\Auth\Access\Response;

/**
 * How one actor's profile answers whether it may have an access on a subject: a Laravel response, allowed or
 * denied. A malformed or unavailable grant is a structural failure and throws instead.
 */
interface Authorizer
{
    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject  the locked record for a record policy, the model class otherwise
     *
     * @throws GrantNotRegistered
     */
    public function evaluate(string $policy, Actor $actor, object|string $subject, AccessType $access): Response;
}
