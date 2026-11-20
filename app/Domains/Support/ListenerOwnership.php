<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Contracts\Event;
use App\Domains\Exceptions\InvalidListener;
use App\Exports\Support\Exports;
use App\Ui\Contracts\UserInterfaceUpdater;
use ReflectionClass;

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
        private Exports $coreExports,
        private array $coreListenerFolders,
    ) {}

    public function assertOwnership(
        string $event,
        string $listener,
        string $method,
        DomainEntry|null $listenerDomain,
    ): void {
        $owner = $this->eventDomain($event, $listener);

        if ($owner === null) {
            $isCoreListener = $listenerDomain === null;
            if (! $isCoreListener && ! $this->coreExports->hasEvent($event)) {
                throw InvalidListener::privateEvent($listener, $method, $event, self::CORE);
            }

            return;
        }

        if ($listenerDomain === null) {
            $isExportedUiEvent = $owner->exportsEvent($event) && is_subclass_of($event, UserInterfaceUpdater::class);
            if (! $isExportedUiEvent) {
                throw InvalidListener::privateEvent($listener, $method, $event, $owner->name);
            }

            return;
        }

        if ($listenerDomain === $owner) {
            return;
        }

        if (! $listenerDomain->requiresDomain($owner)) {
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
        $file = new ReflectionClass($class)->getFileName();
        $domain = $this->stateSource($file, $listener, $event);
        $ownsClass = $domain === null ? str_starts_with($class, 'App\\') : $domain->ownsName($class);

        if (! $ownsClass) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        return $domain;
    }

    public function stateSource(string|false $file, string $listener, string $event): DomainEntry|null
    {
        if ($file === false) {
            throw InvalidListener::unknownOwner($listener, $event);
        }

        $domain = array_find($this->registry->all(), fn (DomainEntry $entry) => $entry->holdsFile($file));

        if ($domain === null && ! str_starts_with($file, dirname(__DIR__, 2).DIRECTORY_SEPARATOR)) {
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
        $file = (string) new ReflectionClass($class)->getFileName();
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
    private function eventDomain(string $event, string $listener): DomainEntry|null
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
     * @return list<class-string<Event>>
     */
    public function exportedEvents(): array
    {
        return [
            ...$this->coreExports->events,
            ...array_merge(
                [],
                ...array_map(fn (DomainEntry $entry) => $entry->exports->events, $this->registry->all()),
            ),
        ];
    }
}
