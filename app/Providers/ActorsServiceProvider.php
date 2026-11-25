<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Actors\ActiveActorRegistration as ActiveActorRegistrationContract;
use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Actors\ActorRunner;
use App\Contracts\Actors\ActorTypes;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Authorization\AuthorizerProviderRegistration as AuthorizerProviderRegistrationContract;
use App\Contracts\Authorization\CurrentAuthorizer as CurrentAuthorizerContract;
use App\Contracts\Authorization\PolicyCatalogue as PolicyCatalogueContract;
use App\Contracts\Authorization\ReadEntitlements as ReadEntitlementsContract;
use App\Contracts\Authorization\SystemEntryPolicies as SystemEntryPoliciesContract;
use App\Contracts\Authorization\TargetAuthorizer as TargetAuthorizerContract;
use App\Contracts\Inboxes\InboxMemberPolicies as InboxMemberPoliciesContract;
use App\Contracts\Presence\UserPresences as UserPresencesContract;
use App\Contracts\Time\ServerClock as ServerClockContract;
use App\Contracts\Work\ActorStackSessions;
use App\Support\ActiveActorRegistration;
use App\Support\ActorContext;
use App\Support\ActorProviderRegistry;
use App\Support\ActorStore;
use App\Support\AuthorizerProviderRegistration;
use App\Support\CurrentAuthorizer;
use App\Support\InboxMemberPolicies;
use App\Support\JournalVisibility;
use App\Support\PolicyCatalogue;
use App\Support\PresenceWindow;
use App\Support\ReadEntitlements;
use App\Support\ServerClock;
use App\Support\SystemActor;
use App\Support\SystemActors;
use App\Support\SystemAuthorizerProvider;
use App\Support\SystemEntryPolicies;
use App\Support\TargetAuthorizer;
use App\Support\UserPresences;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the actor contracts to this request's actor store, which is scoped, so a long-running worker forgets the
 * actor between requests, and lets the readers that take ActorContext directly read it from that store. The presence
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
        $this->app->bind(ActorContext::class, fn (Application $app) => $app->make(CurrentActor::class)->actor());

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
