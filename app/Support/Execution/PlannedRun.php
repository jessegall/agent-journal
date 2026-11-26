<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\CommandRules\Enums\BuiltinCommand;
use App\CommandRules\Enums\StepType;
use App\Processes\Contracts\Events\RunEvents;
use App\Processes\Contracts\StopSignal as StopSignalContract;
use App\Processes\Execution\RunState;
use App\Processes\Execution\StopSignal;
use App\Processes\Values\PlanWord;
use App\Values\ExecutionContext;
use App\Values\ExecutionPlan;

/**
 * An execution plan handed to the supervisor: where its events go, the plan, the shell context it starts in and the
 * signal that may stop it.
 */
final readonly class PlannedRun
{
    public function __construct(
        public RunEvents $events,
        public ExecutionPlan $plan,
        public ExecutionContext $context,
        public StopSignalContract $stop = new StopSignal(),
    ) {}

    /**
     * The words of each call of one builtin in the plan, as written, to check before anything runs.
     *
     * @return list<list<string>>
     */
    public function callsOf(BuiltinCommand $command): array
    {
        $calls = [];

        foreach ($this->plan->steps() as $step) {
            $words = array_map(fn (PlanWord $word) => (string) $word->literal(), $step->argv);

            if ($step->type === StepType::Builtin && $words[0] === $command->value) {
                $calls[] = $words;
            }
        }

        return $calls;
    }

    public function start(): ActiveRun
    {
        return new ActiveRun($this->plan->root, $this->context, new RunState($this->events, $this->stop));
    }
}
