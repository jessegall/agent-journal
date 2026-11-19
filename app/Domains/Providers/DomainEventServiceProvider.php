<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\CoreApi;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\AvailableListener;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\FailureLoggingListener;
use App\Domains\Support\ListenerPolicy;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;

/**
 * The one place listeners are registered: it discovers the Listeners folders of Core and every domain, and lets
 * through only the pairs the listener policy allows, on a fresh boot, when the event cache is written and when a
 * cached map is read.
 */
final class DomainEventServiceProvider extends EventServiceProvider
{
    public function shouldDiscoverEvents(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<string>>
     *
     * @throws InvalidListener
     */
    public function discoverEvents(): array
    {
        $policy = $this->policy();

        return $policy->check($policy->expand(parent::discoverEvents()));
    }

    /**
     * The checked map as the dispatcher registers it, from discovery or the cache alike, with each domain listener
     * gated by its domain's availability.
     *
     * @return array<string, list<string|AvailableListener|FailureLoggingListener>>
     *
     * @throws InvalidListener
     */
    public function getEvents(): array
    {
        if (! $this->app->eventsAreCached()) {
            return $this->policy()->gated(parent::getEvents());
        }

        $cache = require $this->app->getCachedEventsPath();

        if (! isset($cache[self::class])) {
            throw InvalidListener::cacheMissing(self::class);
        }

        return $this->policy()->gated($this->policy()->check($cache[self::class]));
    }

    /**
     * The Listeners folders of every domain and of Core.
     *
     * @return list<string>
     */
    public function discoverEventsWithin(): array
    {
        return [...$this->app->make(DomainRegistry::class)->listenerFolders(), ...$this->coreListenerFolders()];
    }

    private function policy(): ListenerPolicy
    {
        return new ListenerPolicy(
            $this->app->make(DomainRegistry::class),
            CoreApi::exports(),
            $this->coreListenerFolders(),
        );
    }

    /**
     * Core's Listeners folders, and any a test adds through addEventDiscoveryPaths, which count as Core's.
     *
     * @return list<string>
     */
    private function coreListenerFolders(): array
    {
        return [...CoreApi::listenerFolders(), ...self::$eventDiscoveryPaths ?? []];
    }
}
