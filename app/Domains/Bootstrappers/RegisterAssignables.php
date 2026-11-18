<?php

declare(strict_types=1);

namespace App\Domains\Bootstrappers;

use App\Assignments\Contracts\AssignmentRegistration;
use App\Domains\Contracts\DomainBootstrapper;
use App\Domains\Support\DomainEntry;

/**
 * Registers the domain as an owner of assignments, the record types it lets actors hold, the auto-assigners and pools
 * it declares, and the actor types it adds as holders. The owner is always the domain's own name.
 */
final readonly class RegisterAssignables implements DomainBootstrapper
{
    public function __construct(private AssignmentRegistration $assignments) {}

    public function __invoke(DomainEntry $domain): void
    {
        $this->assignments->registerOwner($domain->name, $domain->requiredNames());

        foreach ($domain->assignables() as $type => $providerClass) {
            $this->assignments->registerRecord($type, $providerClass, $domain->name);
        }

        foreach ($domain->autoAssigners() as $definition) {
            $this->assignments->registerAutoAssigner(
                $definition->type,
                $definition->assignerClass,
                $definition->workProviderClass,
                $domain->name,
            );
        }

        foreach ($domain->assignmentPools() as $definition) {
            $this->assignments->registerPool($definition, $domain->name);
        }

        foreach ($domain->assignees() as $assignees) {
            $this->assignments->registerAssignees($assignees);
        }
    }
}
