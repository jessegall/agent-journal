<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Access\Exceptions\PolicyDefinitionConflict;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Exceptions\GrantNotRegistered;

/**
 * Every policy Core and the domains register, with the accesses profile grants may name.
 */
interface PolicyCatalogue
{
    /**
     * @throws PolicyDefinitionConflict
     */
    public function register(string $owner, PolicyDefinition $definition): void;

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
    public function definitionOf(string $policy): PolicyDefinition;

    /**
     * Every registration, enabled owner or not, in the order they were registered.
     *
     * @return list<PolicyDefinition>
     */
    public function definitions(): array;

    /**
     * Every registration whose owner is available now, in the order they were registered.
     *
     * @return list<PolicyDefinition>
     */
    public function grantable(): array;
}
