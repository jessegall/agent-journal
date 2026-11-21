<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Event;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\Reflector;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Model;
use Tests\Support\ScanCache\ScanCache;

/**
 * Every place the code sends an event, found by EventCallScan with the event's class resolved, against the expected
 * producers of each event: a migrated row fact is raised only by its owning model method, and every other event is
 * sent only from the files its area's list names, so a new producer, a moved one or a duplicate fails. A fact two
 * transitions of one model establish names both as its owners.
 *
 * @phpstan-type Expectation array{
 *     role: EventRole, producers: list<string>, owner?: string|list<string>, migrated?: bool, returnedBy?: list<string>,
 *     sample?: Closure(): object
 * }
 */
final readonly class EventProducers
{
    public const string EXPECTED_LISTS = 'tests/Architecture/EventOwners';

    /**
     * The kinds of property a migrated fact may not hold, since it is released after the command ends.
     */
    private const array UNSERIALIZABLE = [Model::class, Container::class, Closure::class];

    /**
     * @param  list<EventProducer>  $producers
     * @param  array<string, list<string>>  $reach  the handlers that reach each file, by path
     */
    private function __construct(private array $producers, private array $reach) {}

    /**
     * The producers of app and every domain's code, each labelled with the command handlers that reach its file.
     *
     * @param  array<class-string, Expectation>  $expected
     * @param  array<string, list<string>>  $reach
     */
    public static function across(string $projectRoot, array $expected, array $reach = []): self
    {
        return self::in($projectRoot, ["{$projectRoot}/app", ...DomainFiles::domainCode()], $expected, $reach);
    }

    /**
     * @param  list<string>  $folders
     * @param  array<class-string, Expectation>  $expected
     * @param  array<string, list<string>>  $reach
     */
    public static function in(string $projectRoot, array $folders, array $expected, array $reach = []): self
    {
        $returned = [];

        foreach ($expected as $event => $expectation) {
            foreach ($expectation['returnedBy'] ?? [] as $method) {
                $returned[$method] = $event;
            }
        }

        $producers = [];

        foreach (ScanCache::findings(new EventCallScan(), DomainFiles::in($folders)) as $call) {
            $event = self::eventOf($call, $returned);

            if (! $call->raises || $event === null) {
                continue;
            }

            $path = substr($call->file, strlen($projectRoot) + 1);
            $producers[] = new EventProducer($path, $call->line, $call->site, $call->call, $event);
        }

        return new self($producers, $reach);
    }

    /**
     * The expected producers of every event, read from each area's list.
     *
     * @return array<class-string, Expectation>
     */
    public static function expected(string $projectRoot): array
    {
        $expected = [];

        foreach (glob("{$projectRoot}/".self::EXPECTED_LISTS.'/*.php') ?: [] as $list) {
            /** @var array<class-string, Expectation> $events */
            $events = require $list;
            $expected = [...$expected, ...$events];
        }

        return $expected;
    }

    /**
     * @return list<EventProducer>
     */
    public function producers(): array
    {
        return $this->producers;
    }

    /**
     * What breaks the expected producers: a producer of an event no list names, a send of a migrated fact from
     * anywhere but its owning model method or the bus publisher, a producer the list does not name, a listed
     * producer that sends nothing, and a migrated fact whose payload cannot be queued.
     *
     * @param  array<class-string, Expectation>  $expected
     * @return list<string>
     */
    public function violations(array $expected, string $busPublisher): array
    {
        $violations = [];

        foreach ($this->producers as $producer) {
            $violation = self::violationOf($producer, $expected[$producer->event] ?? null, $busPublisher);

            if ($violation !== null) {
                $violations[] = $violation.$this->reachOf($producer);
            }
        }

        foreach ($expected as $event => $expectation) {
            array_push(
                $violations,
                ...$this->missingProducers($event, $expectation),
                ...self::payloadFaults($event, $expectation),
            );
        }

        return $violations;
    }

    /**
     * @param  array<string, string>  $returned  each method that returns an event, with its event
     */
    private static function eventOf(EventCall $call, array $returned): string|null
    {
        $class = $call->eventClass;

        if ($class !== null && Reflector::isNameSubclassOf($class, Event::class)) {
            return $class;
        }

        return $call->eventMethod === null ? null : $returned[$call->eventMethod] ?? null;
    }

    /**
     * @param  Expectation|null  $expectation
     */
    private static function violationOf(
        EventProducer $producer,
        array|null $expectation,
        string $busPublisher,
    ): string|null {
        if ($expectation === null) {
            return "{$producer->line()}: no list of ".self::EXPECTED_LISTS.' names this event';
        }

        $isMigratedFact = ($expectation['migrated'] ?? false) && $expectation['role']->isRowFact();
        $owners = (array) ($expectation['owner'] ?? []);
        $owner = implode(' or ', $owners);

        if ($isMigratedFact) {
            $isOwner = $producer->isRaise() && in_array($producer->site, $owners, true);

            return $isOwner || $producer->path === $busPublisher
                ? null
                : "{$producer->line()}, a migrated fact: only {$owner} raises it, and the bus releases it";
        }

        return in_array($producer->path, $expectation['producers'], true)
            ? null
            : "{$producer->line()}: only ".implode(', ', $expectation['producers']).' send it';
    }

    /**
     * @param  Expectation  $expectation
     * @return list<string>
     */
    private function missingProducers(string $event, array $expectation): array
    {
        $sending = array_map(
            fn (EventProducer $producer) => $producer->path,
            array_filter($this->producers, fn (EventProducer $producer) => $producer->event === $event),
        );
        $short = ModelWriteScan::shortName($event);

        if (($expectation['migrated'] ?? false) && $expectation['role']->isRowFact()) {
            $raisers = array_filter(
                $this->producers,
                fn (EventProducer $producer) => $producer->event === $event && $producer->isRaise(),
            );

            $owner = implode(' or ', (array) ($expectation['owner'] ?? []));

            return $raisers === [] ? ["{$short}: its owner {$owner} raises it nowhere"] : [];
        }

        return array_values(array_map(
            fn (string $gone) => "{$short}: {$gone} is listed as its producer but sends it no longer; remove it",
            array_diff($expectation['producers'], $sending),
        ));
    }

    /**
     * A migrated fact's payload holds no model, container, closure or unit, and survives serialize and unserialize.
     *
     * @param  class-string  $event
     * @param  Expectation  $expectation
     * @return list<string>
     */
    private static function payloadFaults(string $event, array $expectation): array
    {
        if (! ($expectation['migrated'] ?? false)) {
            return [];
        }

        $short = ModelWriteScan::shortName($event);
        $sample = $expectation['sample'] ?? null;

        if ($sample === null) {
            return ["{$short}: a migrated fact names a sample, so its payload is checked"];
        }

        $faults = [];

        foreach (Reflector::of($event)->properties() as $property) {
            $class = $property->type()
                ->filter(fn (DeclaredType $type) => $type->isNamed() && ! $type->isBuiltin())
                ->map(fn (DeclaredType $type) => $type->name())
                ->getOrElse('');
            $holds = array_filter(
                self::UNSERIALIZABLE,
                fn (string $kind) => Reflector::isNameOf($class, $kind),
            );

            if ($holds !== [] || str_contains($class, 'EventUnit')) {
                $name = $property->name();
                $faults[] = "{$short}: its property \${$name} holds a {$class}, which a queued fact cannot carry";
            }
        }

        $instance = $sample();

        if ($faults === [] && unserialize(serialize($instance)) != $instance) {
            $faults[] = "{$short}: its payload differs after serialize and unserialize";
        }

        return $faults;
    }

    private function reachOf(EventProducer $producer): string
    {
        $handlers = array_diff($this->reach[$producer->path] ?? [], [$producer->site]);

        return $handlers === [] ? '' : ' (reached from '.implode(', ', $handlers).')';
    }
}
