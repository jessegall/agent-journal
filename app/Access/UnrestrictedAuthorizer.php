<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\Authorizer;
use App\Actors\Contracts\Actor;
use App\Agents\Enums\AccessType;
use Illuminate\Auth\Access\Response;

/**
 * The authorizer of a profile that may do everything: it allows, and asks no policy.
 */
final readonly class UnrestrictedAuthorizer implements Authorizer
{
    public function evaluate(string $policy, Actor $actor, object|string $subject, AccessType $access): Response
    {
        return Response::allow();
    }
}
