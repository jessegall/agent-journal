<?php

declare(strict_types=1);

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->refuseDestructiveCommandsOutsideTestDatabases();
    }

    /**
     * Refuses migrate:fresh, migrate:refresh, migrate:reset and db:wipe when the testing environment points at a
     * database that is not a test database: with no .env.testing, --env=testing falls back to the development database.
     */
    protected function refuseDestructiveCommandsOutsideTestDatabases(): void
    {
        $database = DB::connection()->getDatabaseName();

        DB::prohibitDestructiveCommands(
            $this->app->environment('testing') && ! str_starts_with($database, 'journal_hooks_test'),
        );
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        Model::shouldBeStrict(
            ! app()->isProduction(),
        );

        // A lazy load is one query per model: it is refused in every environment, production too.
        Model::preventLazyLoading();

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): Password|null => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
