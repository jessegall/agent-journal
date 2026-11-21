<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceChanged;
use App\Docking\Sources\Contracts\DockSourceDeleted;
use App\Domains\Exceptions\InvalidListener;
use App\Exports\Support\Exports;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * Finds the owners of listener and event declarations and checks their event permissions.
 */
final readonly class ListenerOwnership
{
    /**
     * The interfaces a listener may be typed on in place of a concrete event: the facts that update the UI, and the
     * facts that change or delete a dockable source.
     */
    public const array EXPANDED_INTERFACES = [
        UserInterfaceUpdater::class,
        DockSourceChanged::class,
        DockSourceDeleted::class,
    ];

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
        DomainEntry|null $domain,
    ): void {
        $owner = $this->eventDomain($event, $listener);

        if ($owner === null) {
            $isCoreListener = $domain === null;

            if (! $isCoreListener && ! $this->coreExports->hasEvent($event)) {
                throw InvalidListener::privateEvent($listener, $method, $event, self::CORE);
            }

            return;
        }

        if ($domain === null) {
            $isExpanded = array_filter(
                self::EXPANDED_INTERFACES,
                fn (string $interface) => is_subclass_of($event, $interface),
            ) !== [];
            $isExportedUiEvent = $owner->exportsEvent($event) && $isExpanded;

            if (! $isExportedUiEvent) {
                throw InvalidListener::privateEvent($listener, $method, $event, $owner->name);
            }

            return;
        }

        if ($domain === $owner) {
            return;
        }

        if ($owner->exportsEvent($event) && self::listensThroughCoreContract($event, $listener, $method)) {
            return;
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

    /**
     * Whether the listener takes a Core contract the event implements, so it hears every domain's exported fact of
     * that kind without requiring the domain.
     */
    private static function listensThroughCoreContract(string $event, string $listener, string $method): bool
    {
        $parameters = new ReflectionMethod(Str::before($listener, '@'), $method)->getParameters();
        $type = $parameters === [] ? null : $parameters[0]->getType();

        return $type instanceof ReflectionNamedType
            && in_array($type->getName(), self::EXPANDED_INTERFACES, true)
            && is_subclass_of($event, $type->getName());
    }
}
