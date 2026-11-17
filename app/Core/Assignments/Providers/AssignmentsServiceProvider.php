<?php

declare(strict_types=1);

namespace App\Core\Assignments\Providers;

use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Registry\AssignmentRegistry;
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
    }

    public function boot(): void
    {
        $this->app->booted(fn () => $this->app->make(AssignmentRegistry::class)->checkRecordModels($this->app->make(LinkTypes::class)));
    }
}
