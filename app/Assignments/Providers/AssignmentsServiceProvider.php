<?php

declare(strict_types=1);

namespace App\Assignments\Providers;

use App\Assignments\Actions\WriteAssignments;
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
use App\Assignments\Contracts\AssignedWorkReader;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Contracts\AssignmentRoom;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentReader;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Readers\AssigneeRecords;
use App\Assignments\Readers\AssignmentRecords;
use App\Assignments\Readers\RegisteredAssignedWork;
use App\Assignments\Readers\VisibleRecords;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Storage\DatabaseAssignmentQuery;
use App\Assignments\Storage\DatabaseAssignmentTransaction;
use App\Assignments\Storage\DatabaseAutoAssignments;
use App\Assignments\Support\DenyAllAutoAssignmentAccess;
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
        $this->app->scoped(AssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(AssignmentReader::class, AssignmentRecords::class);
        $this->app->scoped(AssigneeReader::class, AssigneeRecords::class);
        $this->app->scoped(RecordVisibility::class, VisibleRecords::class);
        $this->app->scoped(AssignmentQuery::class, DatabaseAssignmentQuery::class);
        $this->app->scoped(AssignedWorkReader::class, RegisteredAssignedWork::class);
        $this->app->scoped(AutoAssignmentReader::class, DatabaseAutoAssignments::class);
        $this->app->scoped(AssignmentRoom::class, SizeAssignmentRoom::class);
        $this->app->scoped(AutoAssignmentWriter::class, DatabaseAutoAssignments::class);
    }

    public function boot(): void
    {
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
