<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\CommandRules\Enums\StepType;
use App\Processes\Contracts\Events\RunEvents;
use App\Processes\Contracts\StopSignal;
use App\Processes\Values\PartKey;
use App\Processes\Values\PlanStep;

/**
 * What one supervised run tracks while it goes: where it reports, its stop signal, how many attempts each syntax
 * node has had, and the background parts still running under it.
 */
final class RunState
{
    /**
     * @var list<SpawnedPart>
     */
    private array $background = [];

    /**
     * @var array<int, int>
     */
    private array $attempts = [];

    public function __construct(public readonly RunEvents $events, public readonly StopSignal $stop) {}

    /**
     * Queues a part of the run under the next attempt of its syntax node: an xargs or find -exec child runs it again
     * under a new attempt.
     */
    public function queue(PlanStep $step): PartKey
    {
        $this->attempts[$step->node] = ($this->attempts[$step->node] ?? 0) + 1;
        $part = new PartKey($step->node, $this->attempts[$step->node], (string) ($step->argv[0] ?? null)?->literal());
        $this->events->queued($part);

        return $part;
    }

    /**
     * Records every part of a step that does not run as skipped, with the result that decided it.
     */
    public function skipEveryPart(PlanStep $step, string $controllingResult): void
    {
        foreach ($step->flatten() as $part) {
            if (in_array($part->type, [StepType::Command, StepType::Builtin], true)) {
                $this->events->skipped($this->queue($part), $controllingResult);
            }
        }
    }

    public function track(SpawnedPart $part): void
    {
        $this->background[] = $part;
    }

    /**
     * The background parts still to wait for, handed over once.
     *
     * @return list<SpawnedPart>
     */
    public function takeBackground(): array
    {
        $background = $this->background;
        $this->background = [];

        return $background;
    }
}
