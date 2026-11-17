<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domain\DomainEntry;

/**
 * Judges name uses against the domain each file belongs to, the domains it declares it requires and what each owner
 * exports: another domain's class must be on that domain's export list, and a Core class a domain uses must be on
 * CoreApi's list.
 */
final readonly class BoundaryChecker
{
    /**
     * The domain foundation and the core: every domain uses them without declaring it, and they name no domain.
     */
    private const array SHARED_NAMESPACES = ['App\\Domain\\', 'App\\Core\\'];

    private const string SHARED_PLACE = 'the core or the domain foundation';

    /**
     * Core's events and extension requests: a domain hears them, only Core raises them.
     */
    private const string CORE_EVENTS = '/^App\\\\Core\\\\(.+\\\\)?Events\\\\/i';

    /**
     * @param  list<DomainEntry>  $entries
     * @param  list<string>  $coreExports  CoreApi's list of the Core types a domain may use
     */
    public function __construct(
        private array $entries,
        private ProjectRoots $roots,
        private array $coreExports,
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
        $userName = $user->name ?? self::SHARED_PLACE;

        if (! $this->isDomainName($use->name)) {
            if ($user !== null && $this->isPrivateCoreName($use->name)) {
                return [new Violation($use->file, $use->line, $use->name, $userName, 'Core', ViolationType::PrivateCoreType)];
            }

            return $this->isFreeToUse($use->name) ? [] : [new Violation($use->file, $use->line, $use->name, $userName, 'no domain', ViolationType::OutsideEveryDomain)];
        }

        $owner = $this->domainOwning($use->name);

        if ($owner === $user) {
            return [];
        }

        $violations = $this->eventViolations($use, $user, $owner);

        if ($user !== null && $user->requiresDomain($owner)) {
            $isPublic = $owner->exportsName($use->name) || self::isRequirementInDescriptor($use, $user, $owner);

            return $isPublic ? $violations : [...$violations, new Violation($use->file, $use->line, $use->name, $userName, $owner->name, ViolationType::PrivateType)];
        }

        return [...$violations, new Violation($use->file, $use->line, $use->name, $userName, $owner->name, ViolationType::UndeclaredDomain)];
    }

    /**
     * A composition file names a domain or Core class only for what it composes: bootstrap/domains.php the
     * descriptors, bootstrap/providers.php the providers, bootstrap/app.php the middleware, config/auth.php the user
     * model and DatabaseSeeder the owners' seeders. Any other file outside the domains names none.
     *
     * @param  list<NameUse>  $uses
     * @return list<Violation>
     */
    public function compositionViolations(array $uses, string $basePath): array
    {
        $violations = [];

        foreach ($uses as $use) {
            $name = ltrim($use->name, '\\');

            if (! $this->isShared($name) && ! $this->isDomainName($name)) {
                continue;
            }

            if (CompositionSite::holding($use->file, $basePath)?->mayName($name)) {
                continue;
            }

            $owner = $this->isDomainName($name) ? $this->domainOwning($name)->name : 'Core';
            $violations[] = new Violation($use->file, $use->line, $name, self::SHARED_PLACE, $owner, ViolationType::CompositionMisuse);
        }

        return $violations;
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
            if ($call->isEventNamedByString()) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, $userName, ViolationType::StringEventName);
            }

            if ($call->raisesReceivedEvent()) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, $userName, ViolationType::ReRaisedReceivedEvent);
            }

            if ($this->raisesAnotherDomainsEvent($call, $userName)) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, $this->domainOwning($call->event)->name, ViolationType::ReRaisedEvent);
            }

            if ($userName !== self::SHARED_PLACE && $call->raisesClassEventIn(self::CORE_EVENTS)) {
                $violations[] = new Violation($call->file, $call->line, $call->event, $userName, 'Core', ViolationType::ReRaisedEvent);
            }
        }

        return $violations;
    }

    /**
     * Another domain's event is named only in a listener, and only to hear it. This limits naming, not data flow.
     *
     * @return list<Violation>
     */
    private function eventViolations(NameUse $use, DomainEntry|null $user, DomainEntry $owner): array
    {
        if (! $owner->ownsEvent($use->name)) {
            return [];
        }

        if ($user !== null && $user->holdsListenerFile($use->file) && $use->type->canNameAnEventToHearIt()) {
            return [];
        }

        return [new Violation($use->file, $use->line, $use->name, $user->name ?? self::SHARED_PLACE, $owner->name, ViolationType::EventOutsideListener)];
    }

    /**
     * The domain a file belongs to; a file of the shared place belongs to none and may use no domain.
     */
    private function domainHolding(string $path): DomainEntry|null
    {
        return array_find($this->entries, fn (DomainEntry $entry) => $entry->holdsFile($path));
    }

    private function isDomainName(string $name): bool
    {
        return array_any($this->entries, fn (DomainEntry $entry) => $entry->ownsName($name));
    }

    /**
     * The domain a name lies in; ask isDomainName first, since a name of the shared places or a library lies in none.
     */
    private function domainOwning(string $name): DomainEntry
    {
        return array_find($this->entries, fn (DomainEntry $entry) => $entry->ownsName($name)) ?? throw NameOutsideEveryDomain::for($name);
    }

    /**
     * A name outside every domain that any file may use: the core, the domain foundation or code outside the project.
     */
    private function isFreeToUse(string $name): bool
    {
        return $this->isShared($name) || ! $this->roots->startsWithProjectNamespace($name);
    }

    /**
     * Only a domain raises its own events; another domain or the shared places may only hear them.
     */
    private function raisesAnotherDomainsEvent(EventCall $call, string $userName): bool
    {
        if (! $this->isDomainName($call->event)) {
            return false;
        }

        $owner = $this->domainOwning($call->event);

        return $owner->name !== $userName && $call->raisesClassEventOf($owner);
    }

    /**
     * A domain's own Domain class names the Domain classes it requires; that is the one place a descriptor may be named.
     */
    private static function isRequirementInDescriptor(NameUse $use, DomainEntry $user, DomainEntry $owner): bool
    {
        return basename($use->file) === "{$user->name}Domain.php" && strcasecmp(ltrim($use->name, '\\'), $owner->className()) === 0;
    }

    /**
     * A Core class that is not on CoreApi's list; Core is private by default, whatever folder a class sits in.
     */
    private function isPrivateCoreName(string $name): bool
    {
        $name = ltrim($name, '\\');

        return stripos($name, 'App\\Core\\') === 0 && ! in_array(strtolower($name), array_map(strtolower(...), $this->coreExports), true);
    }

    private function isShared(string $name): bool
    {
        return array_any(self::SHARED_NAMESPACES, fn (string $shared) => stripos(ltrim($name, '\\'), $shared) === 0);
    }
}
