<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;

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
     * @param  class-string<AssignableProvider>  $providerClass
     */
    public function registerRecord(
        string $type,
        string $providerClass,
        string $owner,
        AssignmentPurpose $purpose,
    ): void;

    public function registerAutoAssigner(AutoAssignerDefinition $definition, string $owner): void;

    public function registerPool(PoolDefinition $pool, string $owner): void;

    public function registerAssignees(AssigneeRegistration $registration): void;

    /**
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerActivity(ActivityRegistration $registration): void;
}
