<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Assignments\AssignedWorkResolver as AssignedWorkResolverContract;
use App\Contracts\Assignments\AssigneeLocks as AssigneeLocksContract;
use App\Contracts\Assignments\AssigneeResolver as AssigneeResolverContract;
use App\Contracts\Assignments\AssignmentFactPublisher as AssignmentFactPublisherContract;
use App\Contracts\Assignments\AssignmentProviders;
use App\Contracts\Assignments\AssignmentQuery as AssignmentQueryContract;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Assignments\AssignmentResolver as AssignmentResolverContract;
use App\Contracts\Assignments\AssignmentStorage as AssignmentStorageContract;
use App\Contracts\Assignments\AssignmentTransaction as AssignmentTransactionContract;
use App\Contracts\Assignments\AssignmentWriter;
use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Assignments\AutoAssignmentTrigger as AutoAssignmentTriggerContract;
use App\Contracts\Assignments\AutoAssignmentWriter;
use App\Contracts\Assignments\ClaimRelease as ClaimReleaseContract;
use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Contracts\Assignments\MaintenanceAssignmentWriter;
use App\Contracts\Assignments\ResponsibilityWriter as ResponsibilityWriterContract;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Records\RecordVisibility as RecordVisibilityContract;
use App\Enums\Agents\AccessType;
use App\Policies\AssignmentPolicy;
use App\Policies\AssignmentRecipientPolicy;
use App\Resolvers\AssignedWorkResolver;
use App\Resolvers\AssigneeResolver;
use App\Resolvers\AssignmentResolver;
use App\Resolvers\RecordVisibility;
use App\Support\AdmitPublicAssignments;
use App\Support\AssigneeLocks;
use App\Support\AssignmentFactPublisher;
use App\Support\AssignmentRoom;
use App\Support\AutoAssignmentTrigger;
use App\Support\ClaimRelease;
use App\Support\ClosedAutoAssignmentAccess;
use App\Support\LinkTypeRegistry;
use App\Support\Registry\AssignmentRegistry;
use App\Support\ResponsibilityWriter;
use App\Support\Storage\AssignmentQuery;
use App\Support\Storage\AssignmentStorage;
use App\Support\Storage\AssignmentTransaction;
use App\Support\Storage\DatabaseAutoAssignments;
use App\Support\WriteAssignments;
use App\Values\PolicyDefinition;
use App\Values\ReadEntitlement;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of assignable record types and actor types for the worker, and checks once the application has
 * booted that every registered type is a link alias of an Assignable model and every pool's owner may use its type,
 * so an owner may register its alias, or the type its pool holds, late.
 */
final class AssignmentsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->singleton(AssignmentRegistry::class);
        $this->app->bindIf(AutoAssignmentAccess::class, ClosedAutoAssignmentAccess::class);
        $this->app->bind(AssignmentRegistration::class, AssignmentRegistry::class);
        $this->app->bind(AssignmentProviders::class, AssignmentRegistry::class);
        $this->app->bind(AssignmentTransactionContract::class, AssignmentTransaction::class);
        $this->app->bind(AssignmentStorageContract::class, AssignmentStorage::class);
        $this->app->bind(AssignmentFactPublisherContract::class, AssignmentFactPublisher::class);
        $this->app->scoped(AssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(JournalAssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(MaintenanceAssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(ResponsibilityWriterContract::class, ResponsibilityWriter::class);
        $this->app->scoped(AssigneeLocksContract::class, AssigneeLocks::class);
        $this->app->scoped(AdmitPublicAssignments::class);
        $this->app->scoped(ClaimReleaseContract::class, ClaimRelease::class);
        $this->app->scoped(AssignmentResolverContract::class, AssignmentResolver::class);
        $this->app->scoped(AssigneeResolverContract::class, AssigneeResolver::class);
        $this->app->scoped(RecordVisibilityContract::class, RecordVisibility::class);
        $this->app->scoped(AssignmentQueryContract::class, AssignmentQuery::class);
        $this->app->scoped(AssignedWorkResolverContract::class, AssignedWorkResolver::class);
        $this->app->scoped(AutoAssignmentResolver::class, DatabaseAutoAssignments::class);
        $this->app->scoped(AutoAssignmentTriggerContract::class, AutoAssignmentTrigger::class);
        $this->app->alias(DatabaseAutoAssignments::class, AutoAssignmentWriter::class);
        $this->app->scoped(AssignmentRoom::class);
        $this->app->scoped(DatabaseAutoAssignments::class);
    }

    public function boot(PolicyCatalogue $policies, ReadEntitlements $reads): void
    {
        $readGrant = ReadEntitlement::grant(AssignmentPolicy::class);

        $reads->declare('assignees_list', $readGrant);
        $reads->declare('assignments_read', $readGrant);

        $policies->register('Core', new PolicyDefinition(
            AssignmentPolicy::class,
            [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
            ],
        ));

        $policies->register('Core', new PolicyDefinition(
            AssignmentRecipientPolicy::class,
            [
                AccessType::Create,
                AccessType::Delegate,
                AccessType::Delete,
            ],
        ));

        $this->loadCoreRoutes('assignments/assignments.php');

        $this->app->booted(function (): void {
            $registry = $this->app->make(AssignmentRegistry::class);
            $registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
            $registry->checkPools();
        });
    }
}
