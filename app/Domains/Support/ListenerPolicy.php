<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;
use App\Domains\Exceptions\InvalidListener;
use App\Exports\Support\Exports;
use App\Ui\Contracts\UpdatesUserInterface;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;
use ReflectionUnionType;

/**
 * Decides which event and listener pairs the application may register: an owner hears its own events, a domain hears
 * an event of a domain it requires only when that event is exported under events, and any domain hears Core's exported
 * events. It holds declarations only, never request or actor state.
 */
final readonly class ListenerPolicy
{
    private const string CORE = 'Core';

    /**
     * @param  list<string>  $coreListenerFolders
     */
    public function __construct(
        private DomainRegistry $registry,
        private Exports $coreExports,
        private array $coreListenerFolders,
    ) {}

    /**
     * Turns a listener of UpdatesUserInterface into a listener of each exported event that implements it.
     *
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string>>
     */
    public function expand(array $events): array
    {
        $listeners = $events[UpdatesUserInterface::class] ?? [];
        unset($events[UpdatesUserInterface::class]);

        if ($listeners === []) {
            return $events;
        }

        foreach ($this->exportedEvents() as $event) {
            if (is_subclass_of($event, UpdatesUserInterface::class)) {
                $events[$event] = array_values(array_unique([...$events[$event] ?? [], ...$listeners]));
            }
        }

        return $events;
    }

    /**
     * The same map, after every pair in it is allowed; the first pair that is not stops the application.
     *
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string>>
     *
     * @throws InvalidListener
     */
    public function check(array $events): array
    {
        foreach ($events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $this->checkPair($event, $listener);
            }
        }

        return $events;
    }

    /**
     * The checked map as the dispatcher runs it: each domain's listener gated by that domain's availability, Core's
     * listeners as they are. The map itself keeps every declaration.
     *
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string|AvailableListener|FailureLoggingListener>>
     *
     * @throws InvalidListener
     */
    public function gated(array $events): array
    {
        $gated = [];

        foreach ($events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $class = explode('@', $listener, 2)[0];

                if (! class_exists($class)) {
                    throw InvalidListener::staleCache($listener, $event);
                }

                $file = (string) new ReflectionClass($class)->getFileName();
                $domain = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->holdsListenerFile($file));
                $available = $domain === null ? $listener : new AvailableListener($domain->name, $listener);
                $gated[$event][] = is_subclass_of($event, LogsListenerFailures::class)
                    ? new FailureLoggingListener($event, $available)
                    : $available;
            }
        }

        return $gated;
    }

    private function checkPair(string $event, string $listener): void
    {
        [$class, $method] = array_pad(explode('@', $listener, 2), 2, 'handle');

        if (! class_exists($class) || ! method_exists($class, $method) || ! $this->firstParameterAccepts(new ReflectionMethod($class, $method), $event)) {
            throw InvalidListener::staleCache($listener, $event);
        }

        if (! class_exists($event) || ! is_subclass_of($event, Event::class) || new ReflectionClass($event)->isAbstract()) {
            throw InvalidListener::notAConcreteEvent($listener, $event);
        }

        $hearer = $this->listenerDomain($class, $listener, $event);
        $owner = $this->eventDomain($event, $listener);

        if ($owner === null) {
            $hearsItself = $hearer === null;
            if (! $hearsItself && ! $this->coreExports->hasEvent($event)) {
                throw InvalidListener::privateEvent($listener, $method, $event, self::CORE);
            }

            return;
        }

        if ($hearer === null) {
            $isExportedUiEvent = $owner->exportsEvent($event) && is_subclass_of($event, UpdatesUserInterface::class);
            if (! $isExportedUiEvent) {
                throw InvalidListener::privateEvent($listener, $method, $event, $owner->name);
            }

            return;
        }

        if ($hearer === $owner) {
            return;
        }

        if (! $hearer->requiresDomain($owner)) {
            throw InvalidListener::notRequired($listener, $event, $owner->name);
        }

        if (! $owner->exportsEvent($event)) {
            throw InvalidListener::privateEvent($listener, $method, $event, $owner->name);
        }
    }

    /**
     * The domain whose Listeners folder holds the listener, or none for a listener in one of Core's folders.
     *
     * @param  class-string  $class
     *
     * @throws InvalidListener
     */
    private function listenerDomain(string $class, string $listener, string $event): DomainEntry|null
    {
        $file = (string) new ReflectionClass($class)->getFileName();
        $domain = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->holdsListenerFile($file));
        $isCoreListener = array_any($this->coreListenerFolders, fn (string $folder) => str_starts_with($file, $folder.DIRECTORY_SEPARATOR));

        if ($domain === null && ! $isCoreListener) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        return $domain;
    }

    /**
     * The domain that owns the event, or none for an event of Core.
     *
     * @throws InvalidListener
     */
    private function eventDomain(string $event, string $listener): DomainEntry|null
    {
        $domain = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->ownsName($event));

        if ($domain === null && stripos($event, 'App\\') !== 0) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        return $domain;
    }

    private function firstParameterAccepts(ReflectionMethod $method, string $event): bool
    {
        $type = ($method->getParameters()[0] ?? null)?->getType();
        $arms = $type instanceof ReflectionUnionType ? $type->getTypes() : [$type];

        return array_any($arms, fn (mixed $arm) => $arm instanceof ReflectionNamedType && is_a($event, $arm->getName(), true));
    }

    /**
     * @return list<class-string<Event>>
     */
    private function exportedEvents(): array
    {
        return [...$this->coreExports->events, ...array_merge([], ...array_map(fn (DomainEntry $entry) => $entry->exports->events, $this->registry->all()))];
    }
}
