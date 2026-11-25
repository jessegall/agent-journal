<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\Access\CreateNewUser;
use App\Actions\Access\ResetUserPassword;
use App\Contracts\Actors\ActiveActorRegistration;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\CurrentUserResolver as CurrentUserResolverContract;
use App\Contracts\Admission\JournalAdmission as JournalAdmissionContract;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Inboxes\InboxEligibility as InboxEligibilityContract;
use App\Contracts\Inboxes\InboxMemberRoutes as InboxMemberRoutesContract;
use App\Contracts\Messages\AdmittedRecipients as AdmittedRecipientsContract;
use App\Contracts\Reflection\TypeReflections;
use App\Enums\Agents\AccessType;
use App\Models\Access\Passkey;
use App\Models\Access\User;
use App\Policies\EnvironmentAccessPolicy;
use App\Resolvers\CurrentUserResolver;
use App\Support\Access\AccessSettings;
use App\Support\Access\AdmittedRecipients;
use App\Support\Access\InboxEligibility;
use App\Support\Access\InboxMemberRoutes;
use App\Support\Access\JournalAdmission;
use App\Support\Access\OwnerAuthorizerProvider;
use App\Support\Access\PresentUserCounter;
use App\Support\Access\UserActivity;
use App\Support\Access\UserActors;
use App\Support\Access\UserAssignees;
use App\Support\Access\UserLabels;
use App\Support\Access\UserVisibility;
use App\Support\ActivityDefinition;
use App\Support\AssigneeDefinition;
use App\Values\PolicyDefinition;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;
use Laravel\Passkeys\Passkeys;

class AccessServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CurrentUserResolverContract::class, CurrentUserResolver::class);
        $this->app->bind(JournalAdmissionContract::class, JournalAdmission::class);
        $this->app->bind(AdmittedRecipientsContract::class, AdmittedRecipients::class);
        $this->app->bind(InboxEligibilityContract::class, InboxEligibility::class);
        $this->app->singleton(InboxMemberRoutesContract::class, InboxMemberRoutes::class);

        // The owner's row is read on the first use of the settings, never while a service that holds them is built.
        $this->app->singleton(AccessSettings::class, fn (): AccessSettings => $this->app->make(TypeReflections::class)
            ->of(AccessSettings::class)
            ->newLazyGhost(function (
                AccessSettings $settings,
            ): void {
                $ownerEmail = $this->app->make('config')->get('access.owner_email');
                $settings->__construct(is_string($ownerEmail) ? User::resolveOwnerIdFor($ownerEmail) : null);
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
        AssignmentRegistration $assignments,
        PolicyCatalogue $policies,
    ): void {
        $actors->register(User::class, UserActors::class);
        $assignments->registerAssignees(new AssigneeDefinition(User::storedType(), UserAssignees::class));
        $assignments->registerActivity(new ActivityDefinition(User::storedType(), UserActivity::class));
        $policies->register('Core', new PolicyDefinition(EnvironmentAccessPolicy::class, [AccessType::Edit]));
        $authorizers->register(User::class, OwnerAuthorizerProvider::class);
        $actors->registerLabels(User::class, UserLabels::class);
        $actors->registerVisibility(User::class, UserVisibility::class);
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
