<?php

declare(strict_types=1);

namespace App\Core\Assignments\Providers;

use App\Core\Assignments\Actions\WriteAssignments;
use App\Core\Assignments\Console\AssignRecordCommand;
use App\Core\Assignments\Console\ReassignRecordCommand;
use App\Core\Assignments\Console\ShowAssignmentCommand;
use App\Core\Assignments\Console\UnassignRecordCommand;
use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentProviders;
use App\Core\Assignments\Contracts\AssignmentReader;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Readers\AssigneeRecords;
use App\Core\Assignments\Readers\AssignmentRecords;
use App\Core\Assignments\Registry\AssignmentRegistry;
use App\Core\Assignments\Storage\DatabaseAssignmentTransaction;
use App\Core\Links\Support\LinkTypes;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of assignable record types and actor kinds for the worker, and checks once the application has
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
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/assignments.php');
        $this->commands([ShowAssignmentCommand::class, AssignRecordCommand::class, ReassignRecordCommand::class, UnassignRecordCommand::class]);
        $this->app->booted(fn () => $this->app->make(AssignmentRegistry::class)->checkRecordModels($this->app->make(LinkTypes::class)));
    }
}
