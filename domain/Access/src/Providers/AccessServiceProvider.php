<?php

declare(strict_types=1);

namespace Domain\Access\Providers;

use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Enums\ActorType;
use App\Web\Contracts\CurrentUserReader;
use Domain\Access\Actions\CreateNewUser;
use Domain\Access\Actions\ResetUserPassword;
use Domain\Access\Models\Passkey;
use Domain\Access\Models\User;
use Domain\Access\Readers\CurrentUserRecords;
use Domain\Access\Support\AccessSettings;
use Domain\Access\Support\JournalAccess;
use Domain\Access\Support\PresentUserCounter;
use Domain\Access\Support\UserActors;
use Domain\Access\Support\UserAssignees;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;
use Laravel\Passkeys\Passkeys;
use ReflectionClass;

class AccessServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CurrentUserReader::class, CurrentUserRecords::class);
        $this->app->bind(JournalAccessPolicy::class, JournalAccess::class);
        // The owner's row is read on the first use of the settings, never while a service that holds them is built.
        $this->app->singleton(AccessSettings::class, fn (): AccessSettings => (new ReflectionClass(AccessSettings::class))->newLazyGhost(function (AccessSettings $settings): void {
            $ownerEmail = $this->app->make('config')->get('access.owner_email');
            $settings->__construct(is_string($ownerEmail) ? User::ownerIdFor($ownerEmail) : null);
        }));
        $this->app->scoped(UserAssignees::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(ActorProviderRegistration $actors, ActiveActorRegistration $presentActors): void
    {
        $actors->register(ActorType::User, UserActors::class);
        $presentActors->register(PresentUserCounter::class);
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
        Passkeys::usePasskeyModel(Passkey::class);
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
