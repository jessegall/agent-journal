<?php

declare(strict_types=1);

namespace App\Assignments\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Assignments\Actions\AdmitPublicAssignments;
use App\Assignments\Actions\WriteAssignments;
use App\Assignments\Actions\WriteResponsibilities;
use App\Assignments\Console\AssignRecordCommand;
use App\Assignments\Console\AutoAssignmentPoolsCommand;
use App\Assignments\Console\ConfigureAutoAssignmentCommand;
use App\Assignments\Console\DisableAutoAssignmentCommand;
use App\Assignments\Console\EnableAutoAssignmentCommand;
use App\Assignments\Console\ListAutoAssignmentsCommand;
use App\Assignments\Console\ReassignRecordCommand;
use App\Assignments\Console\ShowAssignmentCommand;
use App\Assignments\Console\ShowAutoAssignmentCommand;
use App\Assignments\Console\UnassignRecordCommand;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssigneeLocks;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentAdmission;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentRoom;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Contracts\ClaimRelease;
use App\Assignments\Contracts\PublishesAssignmentFacts;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
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
use App\Links\Support\LinkTypeRegistry;
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
        $this->app->bind(PublishesAssignmentFacts::class, AssignmentFacts::class);
        $this->app->scoped(AssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(ResponsibilityWriter::class, WriteResponsibilities::class);
        $this->app->scoped(AssigneeLocks::class, OrderedAssigneeLocks::class);
        $this->app->scoped(AssignmentAdmission::class, AdmitPublicAssignments::class);
        $this->app->scoped(ClaimRelease::class, ProvedClaimRelease::class);
        $this->app->scoped(AssignmentResolver::class, AssignmentRecords::class);
        $this->app->scoped(AssigneeResolver::class, AssigneeRecords::class);
        $this->app->scoped(RecordVisibility::class, VisibleRecords::class);
        $this->app->scoped(AssignmentQuery::class, DatabaseAssignmentQuery::class);
        $this->app->scoped(AssignedWorkResolver::class, RegisteredAssignedWork::class);
        $this->app->scoped(AutoAssignmentResolver::class, DatabaseAutoAssignments::class);
        $this->app->scoped(AssignmentRoom::class, SizeAssignmentRoom::class);
        $this->app->scoped(AutoAssignmentWriter::class, DatabaseAutoAssignments::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyRegistration(
            AssignmentRecord::class,
            AssignmentPolicy::class,
            AssignmentAbility::class,
            coordinatorOnly: [AssignmentAbility::Dispatch, AssignmentAbility::Unassign],
        ));
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/assignments.php');
        $this->commands([
            ShowAssignmentCommand::class,
            AssignRecordCommand::class,
            ReassignRecordCommand::class,
            UnassignRecordCommand::class,
            EnableAutoAssignmentCommand::class,
            ConfigureAutoAssignmentCommand::class,
            DisableAutoAssignmentCommand::class,
            ShowAutoAssignmentCommand::class,
            ListAutoAssignmentsCommand::class,
            AutoAssignmentPoolsCommand::class,
        ]);
        $this->app->booted(function (): void {
            $registry = $this->app->make(AssignmentRegistry::class);
            $registry->checkRecordModels($this->app->make(LinkTypeRegistry::class));
            $registry->checkPools();
        });
    }
}
