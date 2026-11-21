<?php

declare(strict_types=1);

namespace App\Domains\Providers;

use App\Bus\Support\RequiredListenerRegistry;
use App\CoreApi;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Registration\ListenerPolicy;
use App\Domains\Support\AvailableListener;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\FailureLoggingListener;
use App\Domains\Support\ListenerOwnership;
use App\Domains\Support\StateListenerDeclarations;
use App\Hooks\Declarations\StateEvents;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Stack\StateTypes;
use App\Hooks\StateEvents\StateEventBridge;
use App\Pipelines\Contracts\PipelineRunner;
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

    /**
     * The mark of a cache built with the required lane, so a cache from before it fails loudly.
     */
    public const string LANES = '@listener-lanes';

    public const string LANES_VERSION = 'required-and-public-1';

    /**
     * The listeners this process already discovered, by the folders they were discovered in: the files cannot change
     * while it runs, and a test's module fixture adds folders, so it is discovered anew.
     *
     * @var array<string, array<string, list<string>>>
     */
    private static array $discovered = [];

    public function boot(): void
    {
        $this->app->booted(fn () => $this->registerStateBridges());
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
        $events = [...$this->discoverOrdinaryEvents(), self::LANES => [self::LANES_VERSION]];

        if (! $this->app->isBooted()) {
            return $events;
        }

        $stateEventEntries = $this->stateEvents()->cacheEntries();

        if ($stateEventEntries === []) {
            return $events;
        }

        return [...$events, self::STATE_EVENTS => $stateEventEntries];
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
        if ($this->app->eventsAreCached()) {
            $events = $this->cachedEvents();
            unset($events[self::STATE_EVENTS], $events[self::LANES]);
            $gated = $this->policy()->registerCached($events);
        } else {
            $events = array_merge_recursive($this->discoverOrdinaryEvents(), $this->listens());
            $gated = $this->policy()->registerDiscovered($events);
        }

        $this->app->instance(RequiredListenerRegistry::class, new RequiredListenerRegistry($gated->required));

        return $gated->events;
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

        $this->app->instance(StateEvents::class, $states);
        $dispatcher = $this->app->make(Dispatcher::class);

        foreach ($states->eventClasses() as $event) {
            $dispatcher->listen($event, StateEventBridge::LISTENER);
        }
    }

    private function stateEvents(): StateEvents
    {
        return new StateListenerDeclarations($this->listenerOwnership())->declarations(
            $this->app->make(StateTypes::class)->registrationSnapshot(),
            $this->app->make(StateMethods::class),
        );
    }

    /**
     * @return array<string, list<string>>
     */
    private function discoverOrdinaryEvents(): array
    {
        $folders = implode('|', $this->discoverEventsWithin());

        return $this->policy()->discover(self::$discovered[$folders] ??= parent::discoverEvents());
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

        if (($cache[self::class][self::LANES] ?? []) !== [self::LANES_VERSION]) {
            throw InvalidListener::cacheBeforeLanes();
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
        return new ListenerPolicy($this->app->make(PipelineRunner::class), $this->listenerOwnership());
    }

    private function listenerOwnership(): ListenerOwnership
    {
        return new ListenerOwnership(
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
