<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\RunEvents;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\RunEventType;

/**
 * One numbered event as it travels from the host's supervisor to the server: its sequence, type, part and details.
 * The server applies it to the run's records; a repeat under the same number changes nothing.
 */
final readonly class RunEvent
{
    /**
     * @param  array<string, string|int>  $details
     */
    public function __construct(public int $sequence, public RunEventType $type, public PartKey|null $part, public array $details = []) {}

    /**
     * @return array{sequence: int, type: string, part: array{node: int, attempt: int, operation: string}|null, details: array<string, string|int>}
     */
    public function toArray(): array
    {
        $part = $this->part === null ? null : ['node' => $this->part->node, 'attempt' => $this->part->attempt, 'operation' => $this->part->operation];

        return ['sequence' => $this->sequence, 'type' => $this->type->value, 'part' => $part, 'details' => $this->details];
    }

    /**
     * @param  array{sequence: int, type: string, part: array{node: int, attempt: int, operation: string}|null, details: array<string, string|int>}  $event
     */
    public static function fromArray(array $event): self
    {
        $part = $event['part'] === null ? null : new PartKey($event['part']['node'], $event['part']['attempt'], $event['part']['operation']);

        return new self($event['sequence'], RunEventType::from($event['type']), $part, $event['details']);
    }

    /**
     * Applies the event to where the run's events go; a heartbeat carries no part change.
     */
    public function applyTo(RunEvents $events): void
    {
        $part = $this->part ?? new PartKey(0, 0, '');
        match ($this->type) {
            RunEventType::PartQueued => $events->queued($part),
            RunEventType::PartStarted => $events->started($part, (int) $this->details['pid'], (string) $this->details['host']),
            RunEventType::PartStartedInside => $events->startedInside($part, (string) $this->details['host']),
            RunEventType::PartEnded => $events->ended($part, $this->end(), (bool) $this->details['drained']),
            RunEventType::PartSkipped => $events->skipped($part, (string) $this->details['because']),
            RunEventType::PartStartFailed => $events->spawnFailed($part, (string) $this->details['reason']),
            RunEventType::PartStopped => $events->stopped($part, (string) $this->details['reason']),
            RunEventType::PartLost => $events->lost($part),
            RunEventType::RunStopped => $events->runStopped((string) $this->details['reason']),
            RunEventType::Heartbeat => null,
        };
    }

    private function end(): PartEnd
    {
        return match (PartEndType::from((string) $this->details['end'])) {
            PartEndType::Exited => PartEnd::exited((int) $this->details['code']),
            PartEndType::Signalled => PartEnd::signalled((int) $this->details['code']),
            PartEndType::Unavailable => PartEnd::unavailable((string) $this->details['reason']),
            PartEndType::NotYet => PartEnd::notYet(),
        };
    }
}
