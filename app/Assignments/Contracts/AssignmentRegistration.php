<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\ActivityDefinition;
use App\Assignments\AssigneeDefinition;
use App\Assignments\AutoAssignerDefinition;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\PoolDefinition;

/**
 * Where the application's composition registers which provider answers for each record type and actor type, and the
 * auto-assigners and pools each owner declares. Only the domain foundation and Core's own providers call it, while
 * the application boots.
 */
interface AssignmentRegistration
{
    /**
     * Registers an owner by its domain name with the names of the domains it requires, before it declares anything.
     *
     * @param  list<string>  $requires
     */
    public function registerOwner(string $owner, array $requires): void;

    /**
     * @param  string  $providerClass  a class name, refused unless it is an AssignableProvider
     */
    public function registerRecord(
        string $type,
        string $providerClass,
        string $owner,
        AssignmentPurpose $purpose,
    ): void;

    /**
     * Adds an automatic assigner that the owning domain provides.
     */
    public function registerAutoAssigner(AutoAssignerDefinition $definition, string $owner): void;

    /**
     * Adds a pool of assignees that the owning domain provides.
     */
    public function registerPool(PoolDefinition $pool, string $owner): void;

    /**
     * Adds a type of assignee that records may be assigned to.
     */
    public function registerAssignees(AssigneeDefinition $definition): void;

    /**
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerActivity(ActivityDefinition $definition): void;
}
