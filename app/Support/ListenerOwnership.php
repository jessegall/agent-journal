<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Events\Event;
use App\Contracts\Reflection\ReflectorFactory;
use App\Exceptions\InvalidListener;
use Illuminate\Support\Str;
use PhpOption\Option;

/**
 * Finds the owners of listener and event declarations and checks their event permissions.
 */
final readonly class ListenerOwnership
{
    public const string CORE = 'Core';

    /**
     * @param  list<string>  $coreListenerFolders
     */
    public function __construct(
        private DomainRegistry $registry,
        private array $coreListenerFolders,
        private ReflectorFactory $reflectors,
        private string $corePath,
    ) {}

    public function assertOwnership(
        string $event,
        string $listener,
        string $method,
        DomainEntry|null $domain,
    ): void {
        $owner = $this->eventDomain($event, $listener);

        if ($domain === $owner || $this->listensThroughOpenGroup($event, $listener, $method, $domain)) {
            return;
        }

        // Every core event may be heard: core keeps nothing private.
        if ($owner === null) {
            return;
        }

        if ($domain === null) {
            throw InvalidListener::privateEvent($listener, $method, $event, $owner->name);
        }

        if (! $domain->requiresDomain($owner)) {
            throw InvalidListener::notRequired($listener, $event, $owner->name);
        }

        if (! $owner->exportsEvent($event)) {
            throw InvalidListener::privateEvent($listener, $method, $event, $owner->name);
        }
    }

    /**
     * @param  class-string  $class
     */
    public function stateDomain(string $class, string $listener, string $event): DomainEntry|null
    {
        $domain = $this->stateSource($this->reflectors->make($class)->fileName(), $listener, $event);
        $ownsClass = $domain === null ? str_starts_with($class, 'App\\') : $domain->ownsName($class);

        if (! $ownsClass) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        return $domain;
    }

    /**
     * The domain that holds the file of a state's listener method; a method with no file has no owner.
     *
     * @param  Option<string>  $file
     *
     * @throws InvalidListener
     */
    public function stateSource(Option $file, string $listener, string $event): DomainEntry|null
    {
        if ($file->isEmpty()) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        $domain = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->holdsFile($file->get()));

        if ($domain === null && ! str_starts_with($file->get(), $this->corePath.DIRECTORY_SEPARATOR)) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        return $domain;
    }

    /**
     * The domain whose Listeners folder holds the listener, or none for a listener in one of Core's folders.
     *
     * @param  class-string  $class
     *
     * @throws InvalidListener
     */
    public function listenerDomain(string $class, string $listener, string $event): DomainEntry|null
    {
        $file = $this->reflectors->make($class)->fileName()->getOrElse('');
        $domain = $this->domainHoldingListener($file);

        $isCoreListener = array_any(
            $this->coreListenerFolders,
            fn (string $folder) => str_starts_with($file, $folder.DIRECTORY_SEPARATOR),
        );

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
    public function eventDomain(string $event, string $listener): DomainEntry|null
    {
        $domain = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->ownsName($event));

        if ($domain === null && stripos($event, 'App\\') !== 0) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        return $domain;
    }

    public function domainHoldingListener(string $file): DomainEntry|null
    {
        return array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->holdsListenerFile($file));
    }

    /**
     * Whether the type names a group of events, a base class or an interface an event implements, rather than one event.
     *
     * @param  class-string  $type
     */
    public static function isGroup(string $type): bool
    {
        $reflected = Reflector::of($type);

        return $type !== Event::class && ($reflected->isAbstract() || $reflected->isInterface());
    }

    /**
     * The events of a group: every event class of Core and of the domains that extends or implements it.
     *
     * @param  class-string  $group
     * @return list<class-string<Event>>
     */
    public function eventsOf(string $group): array
    {
        return array_values(array_filter(
            $this->eventClasses(),
            fn (string $event) => in_array($group, Reflector::of($event)->typeNames(), true),
        ));
    }

    /**
     * Every event class that Core's and each domain's Events folder holds.
     *
     * @return list<class-string<Event>>
     */
    public function eventClasses(): array
    {
        // Core keeps its events in one folder per area, a domain in its one Events folder.
        $folders = [
            "{$this->corePath}/Events",
            "{$this->corePath}/Events/*",
            ...array_map(fn (DomainEntry $entry) => "{$entry->folder}/Events", $this->registry->all()),
        ];

        return array_merge([], ...array_map(
            fn (string $folder) => FolderClasses::in($folder, Event::class),
            $folders,
        ));
    }

    /**
     * Whether the listener takes a group the event belongs to and may hear: a group of Core, of its own domain or one
     * its domain exports. An event joins a group by implementing it, so the group's listeners hear it unexported.
     */
    private function listensThroughOpenGroup(
        string $event,
        string $listener,
        string $method,
        DomainEntry|null $domain,
    ): bool {
        $listenerClass = Str::before($listener, '@');

        if (! Reflector::exists($listenerClass)) {
            return false;
        }

        $handler = $this->reflectors->make($listenerClass)->method($method);
        $group = $handler->firstParameterClass()->getOrElse('');

        if (! Reflector::exists($group) || ! self::isGroup($group)) {
            return false;
        }

        if (! Reflector::exists($event) || ! in_array($group, $this->reflectors->make($event)->typeNames(), true)) {
            return false;
        }

        $groupOwner = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->ownsName($group));

        return $groupOwner === null || $groupOwner === $domain || $groupOwner->exportsName($group);
    }
}
