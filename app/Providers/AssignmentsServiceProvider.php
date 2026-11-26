<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Contracts\ReadEntitlements;
use App\Access\Values\PolicyDefinition;
use App\Access\Values\ReadEntitlement;
use App\Agents\Enums\AccessType;
use App\Assignments\AdmitPublicAssignments;
use App\Assignments\AssigneeLocks;
use App\Assignments\AssignmentFactPublisher;
use App\Assignments\AssignmentRoom;
use App\Assignments\ClaimRelease;
use App\Assignments\Contracts\AssignedWorkResolver as AssignedWorkResolverContract;
use App\Assignments\Contracts\AssigneeLocks as AssigneeLocksContract;
use App\Assignments\Contracts\AssigneeResolver as AssigneeResolverContract;
use App\Assignments\Contracts\AssignmentFactPublisher as AssignmentFactPublisherContract;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentQuery as AssignmentQueryContract;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentResolver as AssignmentResolverContract;
use App\Assignments\Contracts\AssignmentStorage as AssignmentStorageContract;
use App\Assignments\Contracts\AssignmentTransaction as AssignmentTransactionContract;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentTrigger as AutoAssignmentTriggerContract;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Contracts\ClaimRelease as ClaimReleaseContract;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Assignments\Contracts\MaintenanceAssignmentWriter;
use App\Assignments\Contracts\ResponsibilityWriter as ResponsibilityWriterContract;
use App\Assignments\ResponsibilityWriter;
use App\Assignments\Storage\AssignmentStorage;
use App\Assignments\Storage\AssignmentTransaction;
use App\Assignments\Storage\DatabaseAutoAssignments;
use App\Assignments\WriteAssignments;
use App\Concerns\LoadsCoreRoutes;
use App\Links\LinkTypeRegistry;
use App\Policies\AssignmentPolicy;
use App\Policies\AssignmentRecipientPolicy;
use App\Records\Contracts\RecordVisibility as RecordVisibilityContract;
use App\Resolvers\AssignedWorkResolver;
use App\Resolvers\AssigneeResolver;
use App\Resolvers\AssignmentResolver;
use App\Resolvers\RecordVisibility;
use App\Support\AutoAssignmentTrigger;
use App\Support\ClosedAutoAssignmentAccess;
use App\Support\Registry\AssignmentRegistry;
use App\Support\Storage\AssignmentQuery;
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
            [AccessType::Read, AccessType::Create, AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(
            AssignmentRecipientPolicy::class,
            [AccessType::Create, AccessType::Delegate, AccessType::Delete],
        ));

        $this->loadCoreRoutes('assignments/assignments.php');

        $this->app->booted(function (): void {
            $registry = $this->app->make(AssignmentRegistry::class);
            $registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
            $registry->checkPools();
        });
    }
}
