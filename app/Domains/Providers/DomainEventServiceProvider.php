<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\CoreApi;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\AvailableListener;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\FailureLoggingListener;
use App\Domains\Support\ListenerPolicy;
use App\Hooks\Declarations\StateEvents;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Events\StateEventBridge;
use App\Hooks\Stack\StateTypes;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;

/**
 * The one place listeners are registered: it discovers the Listeners folders of Core and every domain, and lets
 * through only the pairs the listener policy allows, on a fresh boot, when the event cache is written and when a
 * cached map is read.
 */
final class DomainEventServiceProvider extends EventServiceProvider
{
    private const string STATE_EVENTS = '@state-events';

    public function boot(): void
    {
        $this->app->booted($this->registerStateBridges(...));
    }

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
        $events = $this->discoverOrdinaryEvents();

        if (! $this->app->isBooted()) {
            return $events;
        }

        $entries = $this->stateEvents()->cacheEntries();

        if ($entries === []) {
            return $events;
        }

        return [...$events, self::STATE_EVENTS => $entries];
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
            return $this->policy()->gated(array_merge_recursive($this->discoverOrdinaryEvents(), $this->listens()));
        }

        $events = $this->cachedEvents();
        unset($events[self::STATE_EVENTS]);

        return $this->policy()->gated($this->policy()->check($events));
    }

    private function registerStateBridges(): void
    {
        $states = $this->stateEvents();

        if ($this->app->eventsAreCached()) {
            $events = $this->cachedEvents();

            if (($events[self::STATE_EVENTS] ?? []) !== $states->cacheEntries()) {
                throw InvalidListener::stateCacheChanged();
            }
        }

        $dispatcher = $this->app->make(Dispatcher::class);

        foreach ($states->eventClasses() as $event) {
            $dispatcher->listen($event, StateEventBridge::LISTENER);
        }
    }

    private function stateEvents(): StateEvents
    {
        return $this->policy()->stateEvents(
            $this->app->make(StateTypes::class)->registrationSnapshot(),
            $this->app->make(StateMethods::class),
        );
    }

    /**
     * @return array<string, list<string>>
     */
    private function discoverOrdinaryEvents(): array
    {
        $policy = $this->policy();

        return $policy->check($policy->expand(parent::discoverEvents()));
    }

    /**
     * @return array<string, list<string>>
     */
    private function cachedEvents(): array
    {
        $cache = require $this->app->getCachedEventsPath();

        if (! isset($cache[self::class])) {
            throw InvalidListener::cacheMissing(self::class);
        }

        return $cache[self::class];
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
