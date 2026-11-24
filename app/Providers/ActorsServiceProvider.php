<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Actors\ActiveActorRegistration;
use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Actors\ActorRunner;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Authorization\AuthorizerProviderRegistration;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Authorization\SystemEntryPolicies as SystemEntryPoliciesContract;
use App\Contracts\Authorization\TargetAuthorizer;
use App\Contracts\Inboxes\InboxMemberPolicies;
use App\Contracts\Presence\UserPresences;
use App\Contracts\Time\ServerClock;
use App\Contracts\Work\ActorStackSessions;
use App\Enums\ActorType;
use App\Support\ActiveActorCounterRegistry;
use App\Support\ActorContext;
use App\Support\ActorProviderRegistry;
use App\Support\ActorStore;
use App\Support\AuthorizerProviderRegistry;
use App\Support\CurrentActorAuthorizer;
use App\Support\DatabaseClock;
use App\Support\DeclaredReads;
use App\Support\JournalVisibility;
use App\Support\PresenceWindow;
use App\Support\RegisteredInboxMemberPolicies;
use App\Support\RegisteredPolicies;
use App\Support\SystemActors;
use App\Support\SystemAuthorizerProvider;
use App\Support\SystemEntryPolicies;
use App\Support\TargetActorAuthorizer;
use App\Support\UserPresenceRecords;
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
        $this->app->singleton(RegisteredInboxMemberPolicies::class);
        $this->app->alias(RegisteredInboxMemberPolicies::class, InboxMemberPolicies::class);
        $this->app->alias(SystemEntryPolicies::class, SystemEntryPoliciesContract::class);
        $this->app->bind(CurrentActor::class, ActorStore::class);
        $this->app->bind(CurrentActorSetter::class, ActorStore::class);
        $this->app->bind(ActorRunner::class, ActorStore::class);
        $this->app->singleton(PolicyCatalogue::class, RegisteredPolicies::class);
        $this->app->singleton(ReadEntitlements::class, DeclaredReads::class);
        $this->app->bind(ActorContext::class, fn (Application $app) => $app->make(CurrentActor::class)->actor());

        $this->app->singleton(PresenceWindow::class, fn (Application $app) => new PresenceWindow(
            $app->make('config')->integer('actors.presence_seconds'),
            $app->make('config')->integer('actors.heartbeat_seconds'),
            $app->make('config')->integer('actors.signed_call_refresh_seconds'),
        ));

        $this->app->bind(ServerClock::class, DatabaseClock::class);
        $this->app->singleton(ActiveActorCounterRegistry::class);
        $this->app->bind(ActiveActorRegistration::class, ActiveActorCounterRegistry::class);
        $this->app->bind(UserPresences::class, UserPresenceRecords::class);
        $this->app->singleton(ActorProviderRegistry::class);
        $this->app->alias(ActorProviderRegistry::class, ActorResolver::class);
        $this->app->alias(ActorProviderRegistry::class, ActorProviderRegistration::class);
        $this->app->alias(ActorProviderRegistry::class, ActorLabels::class);
        $this->app->alias(ActorProviderRegistry::class, ActorVisibility::class);
        $this->app->alias(ActorProviderRegistry::class, ActorStackSessions::class);
        $this->app->singleton(AuthorizerProviderRegistry::class);
        $this->app->alias(AuthorizerProviderRegistry::class, AuthorizerProviderRegistration::class);
        $this->app->scoped(CurrentAuthorizer::class, CurrentActorAuthorizer::class);
        $this->app->scoped(TargetAuthorizer::class, TargetActorAuthorizer::class);
    }

    public function boot(ActorProviderRegistration $actors, AuthorizerProviderRegistry $authorizers): void
    {
        $actors->register(ActorType::System, SystemActors::class);
        $actors->registerVisibility(ActorType::System, JournalVisibility::class);
        $authorizers->register(ActorType::System, SystemAuthorizerProvider::class);
        $this->app->booted(fn () => $authorizers->requireEveryType());
        $this->loadCoreRoutes('actors/actors.php');
    }
}
