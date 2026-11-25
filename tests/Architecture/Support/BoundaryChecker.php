<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Events\Event;
use App\Support\DomainEntry;
use App\Support\Reflector;

/**
 * Judges name uses against the domain each file belongs to, the domains it declares it requires and what each owner
 * exports: another domain's class must be on that domain's export list; every Core class may be used.
 */
final readonly class BoundaryChecker
{
    /**
     * The domain foundation and the core, with the factories of core's models: every domain uses them without declaring
     * it, and they name no domain.
     */
    private const array SHARED_NAMESPACES = [
        'App\\',
        'Database\\Factories\\',
    ];

    private const string SHARED_PLACE = 'the core or the domain foundation';

    /**
     * @param  list<DomainEntry>  $entries
     */
    public function __construct(
        private array $entries,
        private ProjectRoots $roots,
        private BoundaryRoots|null $extraRoots = null,
    ) {}

    /**
     * @param  list<NameUse>  $uses
     * @return list<Violation>
     */
    public function violations(array $uses): array
    {
        $violations = [];

        $stateEvents = [];

        foreach ($uses as $use) {
            if ($use->type === NameType::StateEventParameter) {
                $stateEvents[$use->file][strtolower($use->name)] = true;
            }
        }

        foreach ($uses as $use) {
            $isStateListenerUse = $use->type === NameType::StateEventParameter
                || ($use->type === NameType::Import && isset($stateEvents[$use->file][strtolower($use->name)]));
            array_push($violations, ...$this->violationsOf($use, $isStateListenerUse));
        }

        return $violations;
    }

    /**
     * @return list<Violation>
     */
    private function violationsOf(NameUse $use, bool $isStateListenerUse): array
    {
        $user = $this->domainHolding($use->file);
        $userName = $user->name ?? self::SHARED_PLACE;

        if (! $this->isDomainName($use->name)) {
            if ($user !== null
                && $this->isCoreEvent($use->name)
                && ! $isStateListenerUse
                && ! ($user->holdsListenerFile($use->file) && $use->type->canNameAnEventToHearIt())) {
                return [
                    new Violation(
                        $use->file,
                        $use->line,
                        $use->name,
                        $userName,
                        'Core',
                        ViolationType::EventOutsideListener,
                    ),
                ];
            }

            return $this->isFreeToUse($use->name) ? [] : [
                new Violation(
                    $use->file,
                    $use->line,
                    $use->name,
                    $userName,
                    'no domain',
                    ViolationType::OutsideEveryDomain,
                ),
            ];
        }

        $owner = $this->domainOwning($use->name);

        if ($owner === $user) {
            return [];
        }

        $violations = $isStateListenerUse ? [] : $this->eventViolations($use, $user, $owner);

        if ($user !== null && $user->requiresDomain($owner)) {
            $isPublic = $owner->ownsEvent($use->name)
                ? $owner->exportsEvent($use->name)
                : $owner->exportsName($use->name) || self::isRequirementInDescriptor($use, $user, $owner);

            return $isPublic ? $violations : [
                ...$violations,
                new Violation($use->file, $use->line, $use->name, $userName, $owner->name, ViolationType::PrivateType),
            ];
        }

        return [
            ...$violations,
            new Violation($use->file, $use->line, $use->name, $userName, $owner->name, ViolationType::UndeclaredDomain),
        ];
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

            // Every project class a composition file names is judged, Database\\Seeders as much as App and the
            // packages, as Composer's project roots give them; framework and library names keep their treatment.
            if (! $this->roots->startsWithProjectNamespace($name)) {
                continue;
            }

            if (CompositionSite::holding($use->file, $basePath)?->mayName($name)) {
                continue;
            }

            $owner = $this->isDomainName($name) ? $this->domainOwning($name)->name : 'Core';
            $violations[] = new Violation(
                $use->file,
                $use->line,
                $name,
                self::SHARED_PLACE,
                $owner,
                ViolationType::CompositionMisuse,
            );
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
                $violations[] = new Violation(
                    $call->file,
                    $call->line,
                    $call->event,
                    $userName,
                    $userName,
                    ViolationType::StringEventName,
                );
            }

            if ($call->raisesReceivedEvent()) {
                $violations[] = new Violation(
                    $call->file,
                    $call->line,
                    $call->event,
                    $userName,
                    $userName,
                    ViolationType::ReRaisedReceivedEvent,
                );
            }

            if ($this->raisesAnotherDomainsEvent($call, $userName)) {
                $violations[] = new Violation(
                    $call->file,
                    $call->line,
                    $call->event,
                    $userName,
                    $this->domainOwning($call->event)->name,
                    ViolationType::ReRaisedEvent,
                );
            }

            if ($call->registersListenerByHand($this->roots) && ! self::isCheckedRegistrationSite($call->file)) {
                $violations[] = new Violation(
                    $call->file,
                    $call->line,
                    $call->event,
                    $userName,
                    $userName,
                    ViolationType::ListenerRegisteredByHand,
                );
            }

            if ($this->reRaisesCoreEvent($call, $userName)) {
                $violations[] = new Violation(
                    $call->file,
                    $call->line,
                    $call->event,
                    $userName,
                    'Core',
                    ViolationType::ReRaisedEvent,
                );
            }
        }

        return $violations;
    }

    /**
     * Whether a domain raises an event of Core by its class, which only Core may raise.
     */
    private function reRaisesCoreEvent(EventCall $call, string $userName): bool
    {
        return $userName !== self::SHARED_PLACE && $call->raisesClassEvent() && $this->isCoreEvent($call->event);
    }

    /**
     * Another domain's event is named only in a listener, and only to listen to it. This limits naming, not data flow.
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

        return [
            new Violation(
                $use->file,
                $use->line,
                $use->name,
                $user->name ?? self::SHARED_PLACE,
                $owner->name,
                ViolationType::EventOutsideListener,
            ),
        ];
    }

    /**
     * The domain a file belongs to; a file of the shared place belongs to none and may use no domain.
     */
    private function domainHolding(string $path): DomainEntry|null
    {
        return array_find($this->entries, fn (DomainEntry $entry) => $entry->holdsFile($path))
            ?? $this->extraRoots?->packageHolding($path);
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
        return array_find(
            $this->entries,
            fn (DomainEntry $entry) => $entry->ownsName($name),
        ) ?? throw NameOutsideEveryDomain::for($name);
    }

    /**
     * A name outside every domain that any file may use: the core, the domain foundation or code outside the project.
     */
    private function isFreeToUse(string $name): bool
    {
        return $this->isShared($name) || ! $this->roots->startsWithProjectNamespace($name);
    }

    /**
     * Only a domain raises its own events; another domain or the shared places may only listen to them.
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
     * A domain's own Domain class names the Domain classes it requires; that is the one place a descriptor may be
     * named.
     */
    private static function isRequirementInDescriptor(NameUse $use, DomainEntry $user, DomainEntry $owner): bool
    {
        return basename($use->file) === "{$user->name}Domain.php" && strcasecmp(
            ltrim($use->name, '\\'),
            $owner->className(),
        ) === 0;
    }

    /**
     * Core registers state loaders and bridges through checked provider entry points.
     */
    private static function isCheckedRegistrationSite(string $file): bool
    {
        return str_ends_with($file, 'app/Support/Bootstrappers/RegisterStates.php')
            || str_ends_with($file, 'app/Providers/DomainEventServiceProvider.php');
    }

    /**
     * A concrete Core event class, not a group type an event implements: a domain listens to it in a listener, only
     * Core raises it.
     */
    private function isCoreEvent(string $name): bool
    {
        $name = ltrim($name, '\\');

        return stripos($name, 'App\\') === 0 && Reflector::find($name)
            ->filter(fn (Reflector $type) => $type->isSubclassOf(Event::class) && $type->isInstantiable())
            ->isDefined();
    }

    private function isShared(string $name): bool
    {
        return array_any(self::SHARED_NAMESPACES, fn (string $shared) => stripos(ltrim($name, '\\'), $shared) === 0);
    }
}
