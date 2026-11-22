<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\AssignedWorkResolver;
use App\Contracts\AssigneeLocks;
use App\Contracts\AssigneeResolver;
use App\Contracts\AssignmentFactPublisher;
use App\Contracts\AssignmentProviders;
use App\Contracts\AssignmentQuery;
use App\Contracts\AssignmentRegistration;
use App\Contracts\AssignmentResolver;
use App\Contracts\AssignmentStorage;
use App\Contracts\AssignmentTransaction;
use App\Contracts\AssignmentWriter;
use App\Contracts\AutoAssignmentAccess;
use App\Contracts\AutoAssignmentResolver;
use App\Contracts\AutoAssignmentTrigger;
use App\Contracts\AutoAssignmentWriter;
use App\Contracts\ClaimRelease;
use App\Contracts\JournalAssignmentWriter;
use App\Contracts\MaintenanceAssignmentWriter;
use App\Contracts\PolicyCatalogue;
use App\Contracts\ReadEntitlements;
use App\Contracts\RecordVisibility;
use App\Contracts\ResponsibilityWriter;
use App\Enums\AccessType;
use App\Policies\AssignmentPolicy;
use App\Policies\AssignmentRecipientPolicy;
use App\Resolvers\AssigneeRecords;
use App\Resolvers\AssignmentRecords;
use App\Resolvers\RegisteredAssignedWork;
use App\Resolvers\VisibleRecords;
use App\Support\AdmitPublicAssignments;
use App\Support\AssignmentFacts;
use App\Support\AssignmentRoom;
use App\Support\AssignmentTurns;
use App\Support\ClosedAutoAssignmentAccess;
use App\Support\LinkTypeRegistry;
use App\Support\OrderedAssigneeLocks;
use App\Support\ProvedClaimRelease;
use App\Support\Registry\AssignmentRegistry;
use App\Support\Storage\AssignmentStore;
use App\Support\Storage\DatabaseAssignmentQuery;
use App\Support\Storage\DatabaseAssignmentTransaction;
use App\Support\Storage\DatabaseAutoAssignments;
use App\Support\WriteAssignments;
use App\Support\WriteResponsibilities;
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
    public function register(): void
    {
        $this->app->singleton(AssignmentRegistry::class);
        $this->app->bindIf(AutoAssignmentAccess::class, ClosedAutoAssignmentAccess::class);
        $this->app->bind(AssignmentRegistration::class, AssignmentRegistry::class);
        $this->app->bind(AssignmentProviders::class, AssignmentRegistry::class);
        $this->app->bind(AssignmentTransaction::class, DatabaseAssignmentTransaction::class);
        $this->app->bind(AssignmentStorage::class, AssignmentStore::class);
        $this->app->bind(AssignmentFactPublisher::class, AssignmentFacts::class);
        $this->app->scoped(AssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(JournalAssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(MaintenanceAssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(ResponsibilityWriter::class, WriteResponsibilities::class);
        $this->app->scoped(AssigneeLocks::class, OrderedAssigneeLocks::class);
        $this->app->scoped(AdmitPublicAssignments::class);
        $this->app->scoped(ClaimRelease::class, ProvedClaimRelease::class);
        $this->app->scoped(AssignmentResolver::class, AssignmentRecords::class);
        $this->app->scoped(AssigneeResolver::class, AssigneeRecords::class);
        $this->app->scoped(RecordVisibility::class, VisibleRecords::class);
        $this->app->scoped(AssignmentQuery::class, DatabaseAssignmentQuery::class);
        $this->app->scoped(AssignedWorkResolver::class, RegisteredAssignedWork::class);
        $this->app->scoped(AutoAssignmentResolver::class, DatabaseAutoAssignments::class);
        $this->app->scoped(AutoAssignmentTrigger::class, AssignmentTurns::class);
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

        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/assignments/assignments.php');

        $this->app->booted(function (): void {
            $registry = $this->app->make(AssignmentRegistry::class);
            $registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
            $registry->checkPools();
        });
    }
}
