<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Enums\RecordingMode;
use Closure;

/**
 * One driver's exchange cut out of the host's: how it opened, what was typed and printed in order, and the
 * code it ended with, none while it still ran when the run closed.
 */
final readonly class CutExchange
{
    /**
     * @param  list<RecordedEvent>  $events
     */
    public function __construct(public RecordingOpening $opening, public array $events, public int|null $exitCode) {}

    public function withEvent(RecordedEvent $event): self
    {
        return clone ($this, ['events' => [...$this->events, $event]]);
    }

    /**
     * The exchange with these events in place of its own.
     *
     * @param  list<RecordedEvent>  $events
     */
    public function withEvents(array $events): self
    {
        return clone ($this, ['events' => $events]);
    }

    /**
     * The exchange with every real value of its opening and events faked.
     */
    public function fakedBy(RecordingFakes $fakes): self
    {
        $events = array_map(fn (RecordedEvent $event) => $event->fakedBy($fakes), $this->events);

        return clone ($this, ['opening' => $this->opening->fakedBy($fakes), 'events' => $this->reoffset($events)]);
    }

    /**
     * The exchange with each call's body changed by the change.
     *
     * @param  Closure(string): string  $change
     */
    public function withBodies(Closure $change): self
    {
        $events = array_map(
            fn (RecordedEvent $event) => $event->call === null
                ? $event
                : $event->withCall($event->call->withBody($change($event->call->body))),
            $this->events,
        );

        return clone ($this, ['events' => $events]);
    }

    /**
     * The faked events with each output report's chunks at offsets moved by how much the faking lengthened or shortened
     * the chunks of the same process before them, so a played process's output still runs on without a gap.
     *
     * @param  list<RecordedEvent>  $faked  this exchange's events, faked, in the same order
     * @return list<RecordedEvent>
     */
    private function reoffset(array $faked): array
    {
        $shifts = [];

        foreach ($this->events as $index => $event) {
            $real = $event->outputReport();
            $fakedReport = $faked[$index]->outputReport();

            if ($real === null || $fakedReport === null) {
                continue;
            }

            $shift = $shifts[$real->processId] ?? 0;
            $chunkShifts = [];

            foreach ($fakedReport->lengthChangesFrom($real) as $change) {
                $chunkShifts[] = $shift;
                $shift += $change;
            }

            $shifts[$real->processId] = $shift;
            $faked[$index] = $faked[$index]->withOutputReport($fakedReport->shiftedBy($chunkShifts));
        }

        return array_values($faked);
    }

    /**
     * Every text the exchange holds, decoded, one to a line: its argv, folder and environment, what was typed and
     * printed, and each call's path and body, so a search for a real value finds it however it was sent.
     */
    public function text(): string
    {
        $events = array_map(
            fn (RecordedEvent $event) => implode("\n", [
                $event->bytes,
                $event->call->path ?? '',
                $event->call->body ?? '',
                $event->outputReport()?->printed() ?? '',
            ]),
            $this->events,
        );

        return implode("\n", [
            ...$this->opening->argv,
            $this->opening->folder ?? '',
            ...array_values($this->opening->environment),
            ...$events,
        ]);
    }

    public function isTerminal(): bool
    {
        return $this->opening->mode === RecordingMode::Terminal;
    }

    public function endedWith(int $exitCode): self
    {
        return clone ($this, ['exitCode' => $exitCode]);
    }
}
