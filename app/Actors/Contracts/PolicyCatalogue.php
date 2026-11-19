<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use BackedEnum;

/**
 * Every policy Core and the domains register, with the abilities profile grants may name.
 */
interface PolicyCatalogue
{
    /**
     * @throws PolicyRegistrationConflict
     */
    public function register(string $owner, PolicyRegistration $registration): void;

    /**
     * Refuses an ability no available owner's policy grants: an unknown one, or one of a switched-off domain.
     *
     * @param  class-string<Policy>  $policy
     *
     * @throws AbilityNotRegistered
     */
    public function requireGrantable(string $policy, BackedEnum $ability): void;
}
