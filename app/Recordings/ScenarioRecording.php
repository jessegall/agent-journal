<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Enums\Wire;

/**
 * One recorded scenario as it was read: its manifest and each exchange, its opening, events and exit code, in order.
 */
final readonly class ScenarioRecording
{
    /**
     * @param  array<string, CutExchange>  $exchanges  each exchange by its folder name, in order
     */
    private function __construct(private RecordingManifest $manifest, private array $exchanges) {}

    /**
     * @param  array<string, array<string, mixed>>  $fixtures  each exchange's fixture.json by its folder name
     */
    public static function of(RecordingManifest $manifest, array $fixtures): self
    {
        $exchanges = array_map(fn (array $fixture) => new CutExchange(
            RecordingOpening::fromLine((array) $fixture['opening']),
            array_values(array_map(
                fn (array $event) => RecordedEvent::fromLine($event),
                (array) $fixture['events'],
            )),
            $fixture['exit_code'] === null ? null : (int) $fixture['exit_code'],
        ), $fixtures);

        return self::ofExchanges($manifest, $exchanges);
    }

    /**
     * @param  array<string, CutExchange>  $exchanges  each exchange by its folder name, in order
     */
    public static function ofExchanges(RecordingManifest $manifest, array $exchanges): self
    {
        return new self($manifest, $exchanges);
    }

    public function manifest(): RecordingManifest
    {
        return $this->manifest;
    }

    public function exchange(string $name): CutExchange
    {
        return $this->exchanges[$name];
    }

    /**
     * The names of the exchanges recorded on the wire, in order.
     *
     * @return list<string>
     */
    public function exchangesOn(Wire $wire): array
    {
        return array_keys(array_filter(
            $this->exchanges,
            fn (CutExchange $exchange) => $exchange->opening->wire === $wire,
        ));
    }

    /**
     * Every call asked and answered on the wire, in the order the exchanges and their events were recorded.
     *
     * @return list<RecordedCall>
     */
    public function calls(Wire $wire): array
    {
        $calls = [];

        foreach ($this->exchangesOn($wire) as $name) {
            foreach ($this->exchanges[$name]->events as $event) {
                if ($event->call !== null) {
                    $calls[] = $event->call;
                }
            }
        }

        return $calls;
    }
}
