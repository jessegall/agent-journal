<?php

declare(strict_types=1);

namespace App\Assignments\Providers;

use App\Assignments\Actions\WriteAssignments;
use App\Assignments\Console\AssignRecordCommand;
use App\Assignments\Console\ReassignRecordCommand;
use App\Assignments\Console\ShowAssignmentCommand;
use App\Assignments\Console\UnassignRecordCommand;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Readers\AssigneeRecords;
use App\Assignments\Readers\AssignmentRecords;
use App\Assignments\Readers\VisibleRecords;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Storage\DatabaseAssignmentTransaction;
use App\Links\Support\LinkTypeRegistry;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of assignable record types and actor types for the worker, and checks once the application has
 * booted that every registered type is a link alias of an Assignable model, so an owner may register its alias late.
 */
final class AssignmentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AssignmentRegistry::class);
        $this->app->bind(AssignmentRegistration::class, AssignmentRegistry::class);
        $this->app->bind(AssignmentProviders::class, AssignmentRegistry::class);
        $this->app->bind(AssignmentTransaction::class, DatabaseAssignmentTransaction::class);
        $this->app->scoped(AssignmentWriter::class, WriteAssignments::class);
        $this->app->scoped(AssignmentReader::class, AssignmentRecords::class);
        $this->app->scoped(AssigneeReader::class, AssigneeRecords::class);
        $this->app->scoped(RecordVisibility::class, VisibleRecords::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/assignments.php');
        $this->commands([ShowAssignmentCommand::class, AssignRecordCommand::class, ReassignRecordCommand::class, UnassignRecordCommand::class]);
        $this->app->booted(fn () => $this->app->make(AssignmentRegistry::class)->checkRecordModels($this->app->make(LinkTypeRegistry::class)));
    }
}
