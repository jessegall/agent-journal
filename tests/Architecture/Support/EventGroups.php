<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Events\Event;
use App\Support\DeclaredType;
use App\Support\ReflectedProperty;
use App\Support\Reflector;

/**
 * Judges how events form groups: each implements the one base event of its domain, or of its subject in Core; every
 * group interface has events and declares what they all carry; events whose names share a stem share a group; a
 * listener hears only what its type names.
 */
final readonly class EventGroups
{
    /**
     * @param  list<class-string<Event>>  $events  every concrete event class judged
     * @param  list<string>  $domainEventFolders  the Events folders that must hold exactly one base
     * @param  list<class-string>  $groups  every interface of the Contracts folders that extends Event
     */
    public function __construct(private array $events, private array $domainEventFolders, private array $groups) {}

    /**
     * @return list<string>
     */
    public function baseFaults(): array
    {
        $faults = [];

        foreach ($this->events as $event) {
            $bases = $this->basesOf($event);

            if (count($bases) !== 1) {
                $faults[] = $bases === []
                    ? "{$event} implements no base event"
                    : "{$event} implements several base events: ".implode(', ', $bases);

                continue;
            }

            $base = $bases[0];

            $own = Reflector::of($event)->namespaceName();

            if (Reflector::of($base)->namespaceName() !== $own) {
                $faults[] = "{$event} implements {$base}, the base of another domain or subject";
            }
        }

        return $faults;
    }

    /**
     * @return list<string>
     */
    public function domainBaseFaults(): array
    {
        $faults = [];

        foreach ($this->domainEventFolders as $folder) {
            $bases = array_values(array_unique(array_filter(array_map(
                fn (string $event) => $this->baseOf($event),
                array_filter($this->events, fn (string $event) => self::isIn($event, $folder)),
            ))));
            $count = count($bases);

            if ($count !== 1) {
                $faults[] = "{$folder} has {$count} base events instead of one";
            }
        }

        return $faults;
    }

    /**
     * @return list<string>
     */
    public function emptyGroupFaults(): array
    {
        $empty = array_filter(
            $this->groups,
            fn (string $group) => array_find($this->events, fn (string $event) => in_array($group, Reflector::of($event)->typeNames(), true)) === null,
        );

        return array_values(array_map(fn (string $group) => "{$group} is a group no event joins", $empty));
    }

    /**
     * Events of one base whose names begin with the same two words: a group nobody wrote down, unless they share
     * an interface of their own.
     *
     * @return list<string>
     */
    public function stemFaults(): array
    {
        $byStem = [];

        foreach ($this->events as $event) {
            $words = preg_split('/(?=[A-Z])/', Reflector::of($event)->shortName(), -1, PREG_SPLIT_NO_EMPTY) ?: [];

            if (count($words) >= 3) {
                $byStem[($this->baseOf($event) ?? '').'|'.$words[0].$words[1]][] = $event;
            }
        }

        $faults = [];

        foreach ($byStem as $stem => $events) {
            if (count($events) > 1 && $this->sharedGroups($events) === []) {
                $faults[] = explode('|', $stem)[1].' events share no group: '.implode(', ', $events);
            }
        }

        return $faults;
    }

    /**
     * A property every event of a group declares with the same type that the group's interface leaves out, so a
     * listener typed on the group cannot read what all its events carry.
     *
     * @return list<string>
     */
    public function sharedPropertyFaults(): array
    {
        $faults = [];
        $groups = array_values(array_unique([...array_filter(array_map($this->baseOf(...), $this->events)), ...$this->groups]));

        foreach ($groups as $group) {
            $members = array_values(array_filter(
                $this->events,
                fn (string $event) => in_array($group, Reflector::of($event)->typeNames(), true),
            ));

            if (count($members) < 2) {
                continue;
            }

            $shared = array_intersect(...array_map(self::propertiesOf(...), $members));

            foreach (array_diff($shared, self::propertiesOf($group)) as $property) {
                $faults[] = "{$group}: every event of it has {$property}, so the group declares it";
            }
        }

        return $faults;
    }

    /**
     * A listener wired to an event its type does not name hears it through a list kept by hand.
     *
     * @param  array<string, list<string>>  $wiring  each event with its listeners written as Class@method
     * @return list<string>
     */
    public static function wiringFaults(array $wiring): array
    {
        $faults = [];

        foreach ($wiring as $event => $listeners) {
            foreach ($listeners as $listener) {
                [$class, $method] = explode('@', $listener) + [1 => 'handle'];

                if (! Reflector::exists($class)) {
                    continue;
                }

                $declared = Reflector::of($class)->method($method)->parameters()[0]->type();
                $type = $declared->filter(fn (DeclaredType $one) => $one->isNamed())
                    ->map(fn (DeclaredType $one) => $one->name())
                    ->getOrElse('');

                if ($type === '') {
                    $faults[] = "{$listener} is typed on a list of events in place of their group";

                    continue;
                }

                $isNamed = Reflector::exists($event) && in_array($type, Reflector::of($event)->typeNames(), true);

                if (! $isNamed) {
                    $faults[] = "{$listener} hears {$event} through a list, not through its type {$type}";
                }
            }
        }

        return $faults;
    }

    /**
     * @param  list<class-string<Event>>  $events
     * @return list<class-string>
     */
    private function sharedGroups(array $events): array
    {
        $own = array_filter($this->groups, fn (string $group) => count(array_unique(array_map(
            fn (string $event) => $this->baseOf($event),
            array_filter($this->events, fn (string $event) => in_array($group, Reflector::of($event)->typeNames(), true)),
        ))) === 1);

        return array_values(array_filter(
            $own,
            fn (string $group) => array_all($events, fn (string $event) => in_array($group, Reflector::of($event)->typeNames(), true)),
        ));
    }

    /**
     * The base event the event implements, when it implements one.
     *
     * @param  class-string<Event>  $event
     * @return class-string|null
     */
    private function baseOf(string $event): string|null
    {
        return $this->basesOf($event)[0] ?? null;
    }

    /**
     * The base events the event implements: the event interfaces declared in an Events folder, a domain's own or a
     * subject's of Core.
     *
     * @param  class-string<Event>  $event
     * @return list<class-string>
     */
    private function basesOf(string $event): array
    {
        return array_values(array_filter(
            Reflector::of($event)->typeNames(),
            fn (string $type) => $type !== Event::class
                && Reflector::of($type)->isInterface()
                && Reflector::of($type)->isSubclassOf(Event::class)
                && self::isEventsNamespace(Reflector::of($type)->namespaceName()),
        ));
    }

    /**
     * Each public instance property of the type, written as its name and declared type.
     *
     * @param  class-string  $type
     * @return list<string>
     */
    private static function propertiesOf(string $type): array
    {
        $public = array_filter(
            Reflector::of($type)->properties(),
            fn (ReflectedProperty $property) => $property->isPublic() && ! $property->isStatic(),
        );

        return array_values(array_map(
            fn (ReflectedProperty $property) => '$'.$property->name().' ('
                .$property->type()->map(fn (DeclaredType $declared) => $declared->text)->getOrElse('untyped').')',
            $public,
        ));
    }

    private static function isEventsNamespace(string $namespace): bool
    {
        $segments = explode('\\', $namespace);

        return in_array('Events', $segments, true) && ! in_array('Contracts', $segments, true);
    }

    /**
     * @param  class-string<Event>  $event
     */
    private static function isIn(string $event, string $folder): bool
    {
        return dirname((string) Reflector::of($event)->fileName()->getOrElse('')) === $folder;
    }
}
