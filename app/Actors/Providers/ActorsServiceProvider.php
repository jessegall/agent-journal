<?php

declare(strict_types=1);

namespace App\Actors\Providers;

use App\Actors\Contracts\ActiveActorRegistration;
use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\ActorRunner;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\AuthorizerProviderRegistration;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Contracts\ServerClock;
use App\Actors\Contracts\TargetAuthorizer;
use App\Actors\Contracts\UserPresences;
use App\Actors\Contracts\WorkStacks;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActiveActorCounterRegistry;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorProviderRegistry;
use App\Actors\Support\ActorStore;
use App\Actors\Support\AuthorizerProviderRegistry;
use App\Actors\Support\CurrentActorAuthorizer;
use App\Actors\Support\DatabaseClock;
use App\Actors\Support\DeclaredReads;
use App\Actors\Support\JournalVisibility;
use App\Actors\Support\PresenceWindow;
use App\Actors\Support\RegisteredPolicies;
use App\Actors\Support\SystemActors;
use App\Actors\Support\SystemAuthorizerProvider;
use App\Actors\Support\SystemEntryPolicies;
use App\Actors\Support\TargetActorAuthorizer;
use App\Actors\Support\UserPresenceRecords;
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
    public function register(): void
    {
        $this->app->singleton(SystemEntryPolicies::class);
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
        $this->app->alias(ActorProviderRegistry::class, WorkStacks::class);
        $this->app->singleton(AuthorizerProviderRegistry::class);
        $this->app->alias(AuthorizerProviderRegistry::class, AuthorizerProviderRegistration::class);
        $this->app->scoped(CurrentAuthorizer::class, CurrentActorAuthorizer::class);
        $this->app->scoped(TargetAuthorizer::class, TargetActorAuthorizer::class);
    }

    public function boot(ActorProviderRegistration $actors, AuthorizerProviderRegistry $authorizers): void
    {
        $actors->register(ActorType::System, SystemActors::class);
        $actors->registerVisibility(ActorType::System, JournalVisibility::class);
        $actors->registerVisibility(ActorType::Engine, JournalVisibility::class);
        $authorizers->register(ActorType::System, SystemAuthorizerProvider::class);
        $this->app->booted(fn () => $authorizers->requireEveryType());
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/actors.php');
    }
}
