<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Operations\Enums\AccessType;
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
