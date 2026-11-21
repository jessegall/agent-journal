<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceChanged;
use App\Docking\Sources\Contracts\DockSourceDeleted;
use App\Domains\Exceptions\InvalidListener;
use App\Exports\Support\Exports;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\Reflector;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Support\Str;
use PhpOption\Option;

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
                fn (string $interface) => Reflector::exists($interface)
                    && Reflector::isNameSubclassOf($event, $interface),
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
        $domain = $this->stateSource(Reflector::of($class)->fileName(), $listener, $event);
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

        if ($domain === null && ! str_starts_with($file->get(), dirname(__DIR__, 2).DIRECTORY_SEPARATOR)) {
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
        $file = Reflector::of($class)->fileName()->getOrElse('');
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
        $listenerClass = Str::before($listener, '@');

        if (! Reflector::exists($listenerClass)) {
            return false;
        }

        $parameters = Reflector::of($listenerClass)->method($method)->parameters();
        $type = $parameters === [] ? '' : $parameters[0]->type()
            ->filter(fn (DeclaredType $declared) => $declared->isNamed())
            ->map(fn (DeclaredType $declared) => $declared->name())
            ->getOrElse('');

        return in_array($type, self::EXPANDED_INTERFACES, true)
            && Reflector::exists($type)
            && Reflector::isNameSubclassOf($event, $type);
    }
}
