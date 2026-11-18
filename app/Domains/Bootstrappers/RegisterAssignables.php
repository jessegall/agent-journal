<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Assignments\Contracts\AssignmentRegistration;
use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Support\DomainEntry;

/**
 * Registers the record types the domain lets actors hold, and the actor types it adds as holders.
 */
final readonly class RegisterAssignables implements DomainBootstrapper
{
    public function __construct(private AssignmentRegistration $assignments) {}

    public function __invoke(DomainEntry $domain): void
    {
        foreach ($domain->assignables() as $type => $providerClass) {
            $this->assignments->registerRecord($type, $providerClass);
        }

        foreach ($domain->assignees() as $assignees) {
            $this->assignments->registerAssignees($assignees);
        }
    }
}
