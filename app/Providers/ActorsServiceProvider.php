<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\AuthorizerProviderRegistration;
use App\Access\Contracts\AuthorizerProviderRegistration as AuthorizerProviderRegistrationContract;
use App\Access\Contracts\CurrentAuthorizer as CurrentAuthorizerContract;
use App\Access\Contracts\PolicyCatalogue as PolicyCatalogueContract;
use App\Access\Contracts\ReadEntitlements as ReadEntitlementsContract;
use App\Access\Contracts\SystemEntryPolicies as SystemEntryPoliciesContract;
use App\Access\Contracts\TargetAuthorizer as TargetAuthorizerContract;
use App\Access\JournalVisibility;
use App\Access\PolicyCatalogue;
use App\Access\SystemAuthorizerProvider;
use App\Access\SystemEntryPolicies;
use App\Access\TargetAuthorizer;
use App\Actors\ActiveActorRegistration;
use App\Actors\ActorProviderRegistry;
use App\Actors\ActorStore;
use App\Actors\Contracts\ActiveActorRegistration as ActiveActorRegistrationContract;
use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\ActorRunner;
use App\Actors\Contracts\ActorTypes;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\PresenceWindow;
use App\Actors\SystemActor;
use App\Actors\SystemActors;
use App\Actors\UserPresences;
use App\Agents\Status\Contracts\UserPresences as UserPresencesContract;
use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Work\ActorStackSessions;
use App\Inboxes\Contracts\InboxMemberPolicies as InboxMemberPoliciesContract;
use App\Inboxes\InboxMemberPolicies;
use App\Reads\ReadEntitlements;
use App\Support\ActorReference;
use App\Support\CurrentAuthorizer;
use App\Support\ServerClock;
use App\Time\Contracts\ServerClock as ServerClockContract;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the actor contracts to this request's actor store, which is scoped, so a long-running worker forgets the
 * actor between requests, and lets the readers that take ActorReference directly read it from that store. The presence
 * window is read once from config/actors.php; the owners of actors register their counters of present ones, and the
 * viewer's heartbeat route is loaded here.
 */
final class ActorsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->singleton(SystemEntryPolicies::class);
        $this->app->singleton(InboxMemberPolicies::class);
        $this->app->alias(InboxMemberPolicies::class, InboxMemberPoliciesContract::class);
        $this->app->alias(SystemEntryPolicies::class, SystemEntryPoliciesContract::class);
        $this->app->bind(CurrentActor::class, ActorStore::class);
        $this->app->bind(CurrentActorSetter::class, ActorStore::class);
        $this->app->bind(ActorRunner::class, ActorStore::class);
        $this->app->singleton(PolicyCatalogueContract::class, PolicyCatalogue::class);
        $this->app->singleton(ReadEntitlementsContract::class, ReadEntitlements::class);
        $this->app->bind(ActorReference::class, fn (Application $app) => $app->make(CurrentActor::class)->actor());

        $this->app->singleton(PresenceWindow::class, fn (Application $app) => new PresenceWindow(
            $app->make('config')->integer('actors.presence_seconds'),
            $app->make('config')->integer('actors.heartbeat_seconds'),
            $app->make('config')->integer('actors.signed_call_refresh_seconds'),
        ));

        $this->app->bind(ServerClockContract::class, ServerClock::class);
        $this->app->singleton(ActiveActorRegistration::class);
        $this->app->bind(ActiveActorRegistrationContract::class, ActiveActorRegistration::class);
        $this->app->bind(UserPresencesContract::class, UserPresences::class);
        $this->app->singleton(ActorProviderRegistry::class);
        $this->app->alias(ActorProviderRegistry::class, ActorResolver::class);
        $this->app->alias(ActorProviderRegistry::class, ActorProviderRegistration::class);
        $this->app->alias(ActorProviderRegistry::class, ActorLabels::class);
        $this->app->alias(ActorProviderRegistry::class, ActorVisibility::class);
        $this->app->alias(ActorProviderRegistry::class, ActorStackSessions::class);
        $this->app->alias(ActorProviderRegistry::class, ActorTypes::class);
        $this->app->singleton(AuthorizerProviderRegistration::class);
        $this->app->alias(AuthorizerProviderRegistration::class, AuthorizerProviderRegistrationContract::class);
        $this->app->scoped(CurrentAuthorizerContract::class, CurrentAuthorizer::class);
        $this->app->scoped(TargetAuthorizerContract::class, TargetAuthorizer::class);
    }

    public function boot(
        ActorProviderRegistration $actors,
        AuthorizerProviderRegistration $authorizers,
        ActorTypes $types,
    ): void {
        $actors->register(SystemActor::class, SystemActors::class);
        $actors->registerVisibility(SystemActor::class, JournalVisibility::class);
        $authorizers->register(SystemActor::class, SystemAuthorizerProvider::class);
        $this->app->booted(fn () => $authorizers->requireEveryType($types));
        $this->loadCoreRoutes('actors/actors.php');
    }
}
