<?php

declare(strict_types=1);

namespace App\Actors\Providers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorContext;
use App\Actors\Support\PresenceWindow;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Lets the readers that take ActorContext directly read it from this request's actor store. The store itself is
 * scoped and both its interfaces name it (#[Bind]), so a long-running worker forgets the actor between requests. The
 * presence window is read once from config/actors.php.
 */
final class ActorsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ActorContext::class, fn (Application $app) => $app->make(CurrentActor::class)->actor());
        $this->app->singleton(PresenceWindow::class, fn (Application $app) => new PresenceWindow(
            $app->make('config')->integer('actors.presence_seconds'),
            $app->make('config')->integer('actors.heartbeat_seconds'),
            $app->make('config')->integer('actors.signed_call_refresh_seconds'),
        ));
    }
}
