<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\AccessSettings;
use App\Access\Actions\CreateNewUser;
use App\Access\Actions\ResetUserPassword;
use App\Access\AdmittedRecipients;
use App\Access\Contracts\AuthorizerProviderRegistration;
use App\Access\Contracts\JournalAdmission as JournalAdmissionContract;
use App\Access\Contracts\PolicyCatalogue;
use App\Access\InboxEligibility;
use App\Access\InboxMemberRoutes;
use App\Access\JournalAdmission;
use App\Access\OwnerAuthorizerProvider;
use App\Access\PresentUserCounter;
use App\Access\UserActivity;
use App\Access\UserActors;
use App\Access\UserAssignees;
use App\Access\UserLabels;
use App\Access\UserVisibility;
use App\Access\Values\PolicyDefinition;
use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\CurrentUserResolver as CurrentUserResolverContract;
use App\Agents\Enums\AccessType;
use App\Assignments\ActivityDefinition;
use App\Assignments\AssigneeDefinition;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Http\Responses\SignOutResponse;
use App\Inboxes\Contracts\InboxEligibility as InboxEligibilityContract;
use App\Inboxes\Contracts\InboxMemberRoutes as InboxMemberRoutesContract;
use App\Messages\Contracts\AdmittedRecipients as AdmittedRecipientsContract;
use App\Models\Access\Passkey;
use App\Models\Access\User;
use App\Policies\EnvironmentAccessPolicy;
use App\Reflection\Contracts\TypeReflections;
use App\Resolvers\CurrentUserResolver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\LogoutResponse;
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
        $this->app->bind(LogoutResponse::class, SignOutResponse::class);

        // The owner's row is read on the first use of the settings, never while a service that holds them is built.
        $this->app->singleton(AccessSettings::class, fn (): AccessSettings => $this->app->make(TypeReflections::class)
            ->of(AccessSettings::class)
            ->newLazyGhost(function (
                AccessSettings $settings,
            ): void {
                $ownerEmail = $this->app->make('config')->get('journal.access.owner_email');
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
