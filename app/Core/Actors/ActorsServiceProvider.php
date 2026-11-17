<?php

declare(strict_types=1);

namespace App\Core\Actors;

use App\Core\Actors\Exceptions\ActorContextMissing;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own actor, which only an authenticating middleware fills; without it, asking for one fails.
 * The binding is scoped, so a long-running worker forgets the actor between requests.
 */
final class ActorsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(ActorContext::class, fn () => throw ActorContextMissing::forRequest());
    }
}
