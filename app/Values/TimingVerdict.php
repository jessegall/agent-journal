<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Whether a test or check may start now: allowed, or refused while the caller's plan phase still
 * has open or started tasks, naming the plan, the phase and those tasks.
 */
final readonly class TimingVerdict
{
    /**
     * @param  list<int>  $unfinishedTasks  the numbers of the phase's open and started tasks
     */
    private function __construct(public int $plan, public int $phase, public array $unfinishedTasks) {}

    public static function allowed(): self
    {
        return new self(0, 0, []);
    }

    /**
     * @param  list<int>  $unfinishedTasks
     */
    public static function refused(int $plan, int $phase, array $unfinishedTasks): self
    {
        return new self($plan, $phase, $unfinishedTasks);
    }

    public function isAllowed(): bool
    {
        return $this->unfinishedTasks === [];
    }

    public function reason(): AgentText
    {
        $tasks = implode(', ', array_map(fn (int $task): string => "task {$task}", $this->unfinishedTasks));

        return AgentText::of(
            'core.shell.phase_timing',
            ['plan' => $this->plan, 'phase' => $this->phase, 'tasks' => $tasks],
        );
    }
}
