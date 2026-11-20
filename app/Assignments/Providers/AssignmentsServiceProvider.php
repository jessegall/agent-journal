<?php

declare(strict_types=1);

namespace App\Assignments\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Values\PolicyRegistration;
use App\Actors\Values\ReadEntitlement;
use App\Assignments\Actions\AdmitPublicAssignments;
use App\Assignments\Actions\AssignmentTurns;
use App\Assignments\Actions\WriteAssignments;
use App\Assignments\Actions\WriteResponsibilities;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssigneeLocks;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentFactPublisher;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentTrigger;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Contracts\ClaimRelease;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Assignments\Contracts\MaintenanceAssignmentWriter;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Policies\AssignmentRecipientPolicy;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Resolvers\AssigneeRecords;
use App\Assignments\Resolvers\AssignmentRecords;
use App\Assignments\Resolvers\RegisteredAssignedWork;
use App\Assignments\Resolvers\VisibleRecords;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Storage\DatabaseAssignmentQuery;
use App\Assignments\Storage\DatabaseAssignmentTransaction;
use App\Assignments\Storage\DatabaseAutoAssignments;
use App\Assignments\Support\AssignmentFacts;
use App\Assignments\Support\DenyAllAutoAssignmentAccess;
use App\Assignments\Support\OrderedAssigneeLocks;
use App\Assignments\Support\ProvedClaimRelease;
use App\Assignments\Support\SizeAssignmentRoom;
use App\Autoload\Support\FolderClasses;
use App\Links\Support\LinkTypeRegistry;
use App\Operations\Enums\AccessType;
use Illuminate\Console\Command;
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
        $this->app->bindIf(AutoAssignmentAccess::class, DenyAllAutoAssignmentAccess::class);
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
        $this->app->scoped(SizeAssignmentRoom::class);
        $this->app->scoped(DatabaseAutoAssignments::class);
    }

    public function boot(PolicyCatalogue $policies, ReadEntitlements $reads): void
    {
        $reads->declare('assignees_list', ReadEntitlement::grant(AssignmentPolicy::class));
        $reads->declare('assignments_read', ReadEntitlement::grant(AssignmentPolicy::class));
        $policies->register('Core', new PolicyRegistration(
            AssignmentPolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit],
        ));
        $policies->register('Core', new PolicyRegistration(
            AssignmentRecipientPolicy::class,
            [AccessType::Create, AccessType::Delegate, AccessType::Delete],
            coordinatorOnly: [AccessType::Delegate, AccessType::Delete],
        ));
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/assignments.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        $this->app->booted(function (): void {
            $registry = $this->app->make(AssignmentRegistry::class);
            $registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
            $registry->checkPools();
        });
    }
}
