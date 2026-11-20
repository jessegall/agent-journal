<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * The authorizer of a profile that may do everything: it returns normally and asks no policy.
 */
final readonly class UnrestrictedAuthorizer implements Authorizer
{
    public function authorize(Policy $policy, Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
