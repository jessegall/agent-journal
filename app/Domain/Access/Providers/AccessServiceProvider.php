<?php

declare(strict_types=1);

namespace App\Domain\Access\Providers;

use App\Core\Web\Contracts\CurrentUserReader;
use App\Core\Web\Contracts\JournalAccessPolicy;
use App\Domain\Access\Actions\CreateNewUser;
use App\Domain\Access\Actions\ResetUserPassword;
use App\Domain\Access\Readers\CurrentUserRecords;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Access\Support\JournalAccess;
use App\Domain\Access\Support\UserAssignees;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;

class AccessServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CurrentUserReader::class, CurrentUserRecords::class);
        $this->app->bind(JournalAccessPolicy::class, JournalAccess::class);
        $this->app->singleton(AccessSettings::class, function (): AccessSettings {
            $ownerId = $this->app->make('config')->get('access.owner_id');

            return new AccessSettings(is_numeric($ownerId) ? (int) $ownerId : null);
        });
        $this->app->scoped(UserAssignees::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate($request->string(Fortify::username())->lower().'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                $request->string('credential.id')->whenEmpty(fn () => str($request->session()->getId())).'|'.$request->ip(),
            );
        });
    }
}
