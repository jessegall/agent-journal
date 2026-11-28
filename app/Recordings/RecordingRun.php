<?php

declare(strict_types=1);

namespace App\Recordings;

/**
 * One closed recording run: the scenario it recorded (driver/name), the window it was open, and each exchange its
 * wires kept, with what was asked, answered, typed and printed in it.
 */
final readonly class RecordingRun
{
    /**
     * @param  list<CutExchange>  $exchanges
     */
    public function __construct(
        public string $scenario,
        public int $openedAt,
        public int $closedAt,
        public array $exchanges,
    ) {}

    public function driver(): string
    {
        return explode('/', $this->scenario, 2)[0];
    }

    public function name(): string
    {
        return explode('/', $this->scenario, 2)[1] ?? $this->scenario;
    }

    /**
     * Every variable the run's processes were given, by name, so the fakes put each folder back as its variable.
     *
     * @return array<string, string>
     */
    public function environment(): array
    {
        $environments = array_map(fn (CutExchange $exchange) => $exchange->opening->environment, $this->exchanges);

        return array_merge(...$environments);
    }

    /**
     * The real values a faked recording must not hold: every value the run's processes were given.
     *
     * @return list<string>
     */
    public function knownValues(): array
    {
        return array_values(array_unique(array_values($this->environment())));
    }

    /**
     * Each exchange with only the events inside the run's window, so two runs never mix.
     *
     * @return list<CutExchange>
     */
    public function windowed(): array
    {
        return array_map(fn (CutExchange $exchange) => new CutExchange(
            $exchange->opening,
            array_values(array_filter(
                $exchange->events,
                fn (RecordedEvent $event) => $event->at >= $this->openedAt && $event->at <= $this->closedAt,
            )),
            $exchange->exitCode,
        ), $this->exchanges);
    }
}
