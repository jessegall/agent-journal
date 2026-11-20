<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\GrantNotRegistered;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use App\Operations\Enums\AccessType;

/**
 * Every policy Core and the domains register, with the accesses profile grants may name.
 */
interface PolicyCatalogue
{
    /**
     * @throws PolicyRegistrationConflict
     */
    public function register(string $owner, PolicyRegistration $registration): void;

    /**
     * Refuses a pair no registered policy accepts, whether or not its owner is enabled now.
     *
     * @param  class-string<Policy>  $policy
     *
     * @throws GrantNotRegistered
     */
    public function assertSupported(string $policy, AccessType $access): void;

    /**
     * Refuses a pair no available owner's policy accepts: an unknown one, or one of a switched-off domain.
     *
     * @param  class-string<Policy>  $policy
     *
     * @throws GrantNotRegistered
     */
    public function assertGrantable(string $policy, AccessType $access): void;

    /**
     * @param  class-string<Policy>  $policy
     *
     * @throws GrantNotRegistered
     */
    public function registrationOf(string $policy): PolicyRegistration;

    /**
     * Every registration, enabled owner or not, in the order they were registered.
     *
     * @return list<PolicyRegistration>
     */
    public function registrations(): array;

    /**
     * Every registration whose owner is available now, in the order they were registered.
     *
     * @return list<PolicyRegistration>
     */
    public function grantable(): array;
}
