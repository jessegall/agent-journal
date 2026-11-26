<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Contracts\Drivers\DriverAdapters;
use App\Enums\Hooks\HookEvent;

/**
 * Every moment a driver's hooks reach the journal: each native event of each hook protocol that a HookEvent case
 * reads, tested in core's hooks folder.
 */
final readonly class HookEntries
{
    public function __construct(private DriverAdapters $adapters) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        $known = array_filter($this->nativeEvents(), fn (array $event) => HookEvent::tryFrom($event[1]) !== null);

        return array_values(array_map(
            fn (array $event) => new EntryPoint(
                EntryType::Hook,
                "{$event[0]} {$event[1]}",
                'tests/'.EntryType::Hook->folder(),
            ),
            $known,
        ));
    }

    /**
     * Each native event no HookEvent case reads, as its protocol and event.
     *
     * @return list<string>
     */
    public function unknownEvents(): array
    {
        $unknown = array_filter($this->nativeEvents(), fn (array $event) => HookEvent::tryFrom($event[1]) === null);

        return array_values(array_map(fn (array $event) => "{$event[0]} {$event[1]}", $unknown));
    }

    /**
     * @return list<array{string, string}> each protocol with one of its native events
     */
    private function nativeEvents(): array
    {
        $events = [];

        foreach ($this->adapters->all() as $adapter) {
            foreach ($adapter->nativeEvents() as $event) {
                $events[] = [
                    $adapter->hookProtocol(),
                    $event,
                ];
            }
        }

        return $events;
    }
}
