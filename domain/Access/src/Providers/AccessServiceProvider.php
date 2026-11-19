<?php

declare(strict_types=1);

namespace Domain\Access\Providers;

use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\AdmittedRecipients;
use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Enums\ActorType;
use App\Web\Contracts\CurrentUserResolver;
use Domain\Access\Actions\CreateNewUser;
use Domain\Access\Actions\ResetUserPassword;
use Domain\Access\Models\Passkey;
use Domain\Access\Models\User;
use Domain\Access\Resolvers\CurrentUserRecords;
use Domain\Access\Support\AccessSettings;
use Domain\Access\Support\AdmittedUsers;
use Domain\Access\Support\OwnerAdmission;
use Domain\Access\Support\OwnerAuthorizerProvider;
use Domain\Access\Support\PresentUserCounter;
use Domain\Access\Support\UserActors;
use Domain\Access\Support\UserAssignees;
use Domain\Access\Support\UserLabels;
use Domain\Access\Support\UserVisibility;
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
        $this->app->bind(CurrentUserResolver::class, CurrentUserRecords::class);
        $this->app->bind(JournalAdmission::class, OwnerAdmission::class);
        $this->app->bind(AdmittedRecipients::class, AdmittedUsers::class);
        // The owner's row is read on the first use of the settings, never while a service that holds them is built.
        $this->app->singleton(AccessSettings::class, fn (): AccessSettings => new ReflectionClass(AccessSettings::class)->newLazyGhost(function (
            AccessSettings $settings,
        ): void {
            $ownerEmail = $this->app->make('config')->get('access.owner_email');
            $settings->__construct(is_string($ownerEmail) ? User::ownerIdFor($ownerEmail) : null);
        }));
        $this->app->scoped(UserAssignees::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(
        ActorProviderRegistration $actors,
        ActiveActorRegistration $presentActors,
        AuthorizerProviderRegistration $authorizers,
    ): void {
        $actors->register(ActorType::User, UserActors::class);
        $authorizers->register(ActorType::User, OwnerAuthorizerProvider::class);
        $actors->registerLabels(ActorType::User, UserLabels::class);
        $actors->registerVisibility(ActorType::User, UserVisibility::class);
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
                $request->string('credential.id')->whenEmpty(
                    fn () => str($request->session()->getId()),
                ).'|'.$request->ip(),
            );
        });
    }
}
