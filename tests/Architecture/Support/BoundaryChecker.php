<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\DomainEntry;

/**
 * Judges name uses against the domain each file belongs to and the domains it declares it requires.
 */
final readonly class BoundaryChecker
{
    private const string SHARED_NAMESPACE = 'App\\Domains\\';

    private const string SHARED_PLACE = 'Domains';

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
        if ($this->isShared($use->name)) {
            return [];
        }

        $user = $this->domainHolding($use->file);
        $owner = $this->domainOwning($use->name);
        $userName = $user->name ?? self::SHARED_PLACE;

        if ($owner === null && ! $this->roots->startsWithProjectNamespace($use->name)) {
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
        return stripos(ltrim($name, '\\'), self::SHARED_NAMESPACE) === 0;
    }
}
