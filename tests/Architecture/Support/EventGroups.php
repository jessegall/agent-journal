<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Events\Event;
use App\Support\DeclaredType;
use App\Support\ReflectedType;

/**
 * Judges how events form groups: each extends the one base event of its domain, or of its subject in Core; every
 * group interface has events; events whose names share a stem share a group; a listener hears only what its type
 * names.
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
            $base = $this->baseOf($event);

            if ($base === null) {
                $faults[] = "{$event} extends no base event";

                continue;
            }

            $own = ReflectedType::of($event)->namespaceName();

            if (ReflectedType::of($base)->namespaceName() !== $own) {
                $faults[] = "{$event} extends {$base}, the base of another domain or subject";
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
            fn (string $group) => array_find($this->events, fn (string $event) => in_array($group, ReflectedType::of($event)->typeNames(), true)) === null,
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
            $words = preg_split('/(?=[A-Z])/', ReflectedType::of($event)->shortName(), -1, PREG_SPLIT_NO_EMPTY) ?: [];

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

                if (! ReflectedType::exists($class)) {
                    continue;
                }

                $declared = ReflectedType::of($class)->method($method)->parameters()[0]->type();
                $type = $declared->filter(fn (DeclaredType $one) => $one->isNamed())
                    ->map(fn (DeclaredType $one) => $one->name())
                    ->getOrElse('');

                if ($type === '') {
                    $faults[] = "{$listener} is typed on a list of events in place of their group";

                    continue;
                }

                $isNamed = ReflectedType::exists($event) && in_array($type, ReflectedType::of($event)->typeNames(), true);

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
            array_filter($this->events, fn (string $event) => in_array($group, ReflectedType::of($event)->typeNames(), true)),
        ))) === 1);

        return array_values(array_filter(
            $own,
            fn (string $group) => array_all($events, fn (string $event) => in_array($group, ReflectedType::of($event)->typeNames(), true)),
        ));
    }

    /**
     * The abstract event class the event extends directly.
     *
     * @param  class-string<Event>  $event
     * @return class-string<Event>|null
     */
    private function baseOf(string $event): string|null
    {
        $parent = ReflectedType::of($event)->parent();

        if ($parent->isEmpty() || ! $parent->get()->isAbstract() || ! $parent->get()->isSubclassOf(Event::class)) {
            return null;
        }

        return $parent->get()->name();
    }

    /**
     * @param  class-string<Event>  $event
     */
    private static function isIn(string $event, string $folder): bool
    {
        return dirname((string) ReflectedType::of($event)->fileName()->getOrElse('')) === $folder;
    }
}
