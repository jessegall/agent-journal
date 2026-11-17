<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domain\DomainEntry;

/**
 * Judges name uses against the domain each file belongs to and the domains it declares it requires.
 */
final readonly class BoundaryChecker
{
    /**
     * The domain foundation and the core: every domain uses them without declaring it, and they name no domain.
     */
    private const array SHARED_NAMESPACES = ['App\\Domain\\', 'App\\Core\\'];

    private const string SHARED_PLACE = 'the core or the domain foundation';

    /**
     * @param  list<DomainEntry>  $entries
     */
    public function __construct(
        private array $entries,
        private ProjectRoots $roots,
    ) {}

    /**
     * @param  list<NameUse>  $uses
     * @return list<Violation>
     */
    public function violations(array $uses): array
    {
        $violations = [];

        foreach ($uses as $use) {
            array_push($violations, ...$this->violationsOf($use));
        }

        return $violations;
    }

    /**
     * @return list<Violation>
     */
    private function violationsOf(NameUse $use): array
    {
        $user = $this->domainHolding($use->file);
        $owner = $this->domainOwning($use->name);
        $userName = $user->name ?? self::SHARED_PLACE;

        if ($owner === null && ($this->isShared($use->name) || ! $this->roots->startsWithProjectNamespace($use->name))) {
            return [];
        }

        if ($owner === null) {
            return [new Violation($use->file, $use->line, $use->name, $userName, 'no domain', ViolationKind::OutsideEveryDomain)];
        }

        if ($owner === $user) {
            return [];
        }

        $violations = $this->eventViolations($use, $user, $owner);

        if ($user !== null && $user->requiresDomain($owner)) {
            return $violations;
        }

        return [...$violations, new Violation($use->file, $use->line, $use->name, $userName, $owner->name, ViolationKind::UndeclaredDomain)];
    }

    /**
     * Events are named by their class, never by a string, and only their owner raises them.
     *
     * @param  list<EventCall>  $calls
     * @return list<Violation>
     */
    public function eventCallViolations(array $calls): array
    {
        $violations = [];

        foreach ($calls as $call) {
            $userName = $this->domainHolding($call->file)->name ?? self::SHARED_PLACE;
            $owner = $this->domainOwning($call->event);

            if ($call->namesEventByString()) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, $userName, ViolationKind::StringEventName);
            }

            if ($call->raisesReceivedEvent()) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, $userName, ViolationKind::ReRaisedReceivedEvent);
            }

            if ($owner !== null && $owner->name !== $userName && $call->raisesClassEventOf($owner)) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, $owner->name, ViolationKind::ReRaisedEvent);
            }
        }

        return $violations;
    }

    /**
     * Another domain's event is named only in a listener, and only to hear it. This limits naming, not data flow.
     *
     * @return list<Violation>
     */
    private function eventViolations(NameUse $use, ?DomainEntry $user, DomainEntry $owner): array
    {
        if (! $owner->ownsEvent($use->name)) {
            return [];
        }

        if ($user !== null && $user->holdsListenerFile($use->file) && $use->kind->namesEventToHearIt()) {
            return [];
        }

        return [new Violation($use->file, $use->line, $use->name, $user->name ?? self::SHARED_PLACE, $owner->name, ViolationKind::EventOutsideListener)];
    }

    /**
     * The domain a file belongs to; a file of the shared place belongs to none and may use no domain.
     */
    private function domainHolding(string $path): ?DomainEntry
    {
        return array_find($this->entries, fn (DomainEntry $entry) => $entry->holdsFile($path));
    }

    private function domainOwning(string $name): ?DomainEntry
    {
        return array_find($this->entries, fn (DomainEntry $entry) => $entry->ownsName($name));
    }

    private function isShared(string $name): bool
    {
        return array_any(self::SHARED_NAMESPACES, fn (string $shared) => stripos(ltrim($name, '\\'), $shared) === 0);
    }
}
