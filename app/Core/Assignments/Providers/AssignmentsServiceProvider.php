<?php

declare(strict_types=1);

namespace App\Core\Assignments\Providers;

use App\Core\Assignments\Actions\WriteAssignments;
use App\Core\Assignments\Contracts\AssignmentProviders;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
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
    }

    public function boot(): void
    {
        $this->app->booted(fn () => $this->app->make(AssignmentRegistry::class)->checkRecordModels($this->app->make(LinkTypes::class)));
    }
}
