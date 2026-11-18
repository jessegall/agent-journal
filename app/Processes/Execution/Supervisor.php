<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Processes\Contracts\RunEvents;
use App\Processes\Contracts\StopSignal;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\StepType;
use App\Processes\Exceptions\SupervisorRefused;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ExecutionPlan;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use App\Processes\Values\PlanRedirect;
use App\Processes\Values\PlanStep;
use App\Processes\Values\PlanWord;

/**
 * Runs an execution plan step by step (doc 21 revision 6, section 53): control flow decides which parts run, builtins
 * run in the shell context, every external part is spawned from its argv in its own process group with its own record
 * and its own end, pipeline stages run at the same time, and background parts are waited for before the run ends.
 * A part that does not run because of an earlier result is recorded as skipped, never left out.
 */
final readonly class Supervisor
{
    /**
     * Variables a part never inherits: the journal's launch token and the run's event key.
     */
    private const array SECRET_VARIABLES = ['JOURNAL_LAUNCH_TOKEN', 'JOURNAL_EVENT_KEY'];

    /**
     * The most standard output a step keeps in memory as a substitution value; the recorder keeps every byte.
     */
    private const int KEPT_OUTPUT_BYTES = 1_048_576;

    /**
     * How long a stopped part may take to end after the polite signal before it is forced.
     */
    private const float STOP_GRACE_SECONDS = 5.0;

    public function __construct(private BuiltinSteps $builtins) {}

    /**
     * @throws SupervisorRefused
     */
    public function run(RunEvents $events, ExecutionPlan $plan, ExecutionContext $context, StopSignal $stop = new NoStop()): StepOutcome
    {
        $this->builtins->check($plan);
        $state = new RunState($events, $stop);
        $outcome = $this->execute($plan->root, $context, $state);
        foreach ($state->takeBackground() as [$part, $process]) {
            $this->finishExternal($part, $process, $state);
        }
        if ($stop->isRequested()) {
            $events->runStopped($stop->reason());
        }

        return $outcome;
    }

    private function execute(PlanStep $step, ExecutionContext $context, RunState $state): StepOutcome
    {
        if ($state->stop->isRequested()) {
            $this->skip($step, $state, 'the run was stopped: '.$state->stop->reason());

            return new StepOutcome(130, $context);
        }

        return match ($step->type) {
            StepType::Sequence, StepType::Group => $this->inOrder($step->children, $context, $state),
            StepType::AndList => $this->conditional($step->children, $context, $state, true),
            StepType::OrList => $this->conditional($step->children, $context, $state, false),
            StepType::Negation => $this->execute($step->children[0], $context, $state)->negated(),
            StepType::Subshell => $this->inOrder($step->children, $context, $state)->withContext($context),
            StepType::Shell => $this->execute($step->innerShell(), $context->withPositional($step->positional), $state)->withContext($context),
            StepType::Pipeline => $this->pipeline($step, $context, $state),
            StepType::Background => $this->background($step, $context, $state),
            StepType::Builtin, StepType::Command => $this->part($step, $context, $state),
            StepType::Substitution => throw SupervisorRefused::stepNotRun($step->type),
        };
    }

    /**
     * @param  list<PlanStep>  $steps
     */
    private function inOrder(array $steps, ExecutionContext $context, RunState $state): StepOutcome
    {
        $outcome = new StepOutcome(0, $context);
        foreach ($steps as $step) {
            $outcome = $outcome->then($this->execute($step, $outcome->context, $state));
        }

        return $outcome;
    }

    /**
     * a && b runs b only when a succeeded, a || b only when it failed; a step that does not run is recorded as skipped.
     *
     * @param  list<PlanStep>  $steps
     */
    private function conditional(array $steps, ExecutionContext $context, RunState $state, bool $runsOnSuccess): StepOutcome
    {
        $outcome = $this->execute($steps[0], $context, $state);
        foreach (array_slice($steps, 1) as $step) {
            if (($outcome->status === 0) === $runsOnSuccess) {
                $outcome = $outcome->then($this->execute($step, $outcome->context, $state));

                continue;
            }
            $this->skip($step, $state, ($runsOnSuccess ? 'the step before && ' : 'the step before || ')."ended with status {$outcome->status}");
        }

        return $outcome;
    }

    private function skip(PlanStep $step, RunState $state, string $controllingResult): void
    {
        foreach ($step->flatten() as $part) {
            if (in_array($part->type, [StepType::Command, StepType::Builtin], true)) {
                $state->events->skipped($this->queued($part, $state), $controllingResult);
            }
        }
    }

    /**
     * All stages start at once and the supervisor moves the bytes between them; each stage keeps its own end, and the
     * pipeline's status is chosen from them by pipefail without being written into any stage.
     */
    private function pipeline(PlanStep $step, ExecutionContext $context, RunState $state): StepOutcome
    {
        $stages = [];
        foreach ($step->children as $index => $stage) {
            if ($stage->type !== StepType::Command || $stage->children !== []) {
                throw SupervisorRefused::stepNotRun($stage->type);
            }
            $part = $this->queued($stage, $state);
            $process = $this->spawn($part, $stage, [], $context, $state, $index > 0 ? ['pipe', 'r'] : ['file', '/dev/null', 'r']);
            if (is_string($process)) {
                return new StepOutcome(127, $context);
            }
            $stages[] = [$part, $process];
        }
        $stdout = '';
        new PipelinePump()->run(array_column($stages, 1), function (int $index, OutputStream $stream, string $bytes) use ($stages, $state, &$stdout): void {
            $state->events->output($stages[$index][0], $stream, $bytes);
            $stdout .= $index === array_key_last($stages) && $stream === OutputStream::Stdout && strlen($stdout) < self::KEPT_OUTPUT_BYTES ? $bytes : '';
        }, $state->stop);
        $statuses = array_map(fn (array $stage) => $this->finishExternal($stage[0], $stage[1], $state), $stages);
        $failed = array_values(array_filter($statuses, fn (int $status) => $status !== 0));

        return new StepOutcome((int) ($context->pipefail && $failed !== [] ? array_last($failed) : array_last($statuses)), $context, $stdout);
    }

    /**
     * A background part keeps running under the supervisor while the steps after it go on; the run waits for it at
     * its end.
     */
    private function background(PlanStep $step, ExecutionContext $context, RunState $state): StepOutcome
    {
        $child = $step->children[0];
        if ($child->type !== StepType::Command || $child->children !== []) {
            throw SupervisorRefused::stepNotRun($child->type);
        }
        $part = $this->queued($child, $state);
        $process = $this->spawn($part, $child, [], $context, $state, ['file', '/dev/null', 'r']);
        if (! is_string($process)) {
            $state->track($part, $process);
        }

        return new StepOutcome(0, $context);
    }

    /**
     * One builtin or external part: its substitutions run first and supply their output as values, then it runs with its
     * own record.
     */
    private function part(PlanStep $step, ExecutionContext $context, RunState $state): StepOutcome
    {
        $values = [];
        foreach ($step->children as $substitution) {
            $values[$substitution->node] = rtrim($this->inOrder($substitution->children, $context, $state)->output, "\n");
        }
        if ($step->argv === []) {
            $assignments = array_map(fn (PlanWord $word) => $this->text($word, $values), $step->assignments);

            return new StepOutcome(0, $context->withEnvironment([...$context->environment, ...$assignments]));
        }
        $part = $this->queued($step, $state);
        if ($step->type === StepType::Builtin) {
            return $this->builtin($part, array_map(fn (PlanWord $word) => $this->text($word, $values), $step->argv), $context, $state);
        }
        $process = $this->spawn($part, $step, $values, $context, $state, ['file', '/dev/null', 'r']);
        if (is_string($process)) {
            return new StepOutcome(127, $context);
        }
        $stdout = '';
        $drained = $process->drain(function (OutputStream $stream, string $bytes) use ($part, $state, &$stdout): void {
            $state->events->output($part, $stream, $bytes);
            $stdout .= $stream === OutputStream::Stdout && strlen($stdout) < self::KEPT_OUTPUT_BYTES ? $bytes : '';
        }, SpawnedProcess::DRAIN_SECONDS, $state->stop);
        $status = $this->finishExternal($part, $process, $state, $drained);

        return new StepOutcome($status, $context, $stdout);
    }

    /**
     * @param  list<string>  $argv
     */
    private function builtin(PartKey $part, array $argv, ExecutionContext $context, RunState $state): StepOutcome
    {
        $state->events->startedInside($part, gethostname() ?: 'unknown');
        $result = $this->builtins->run($argv[0], array_slice($argv, 1), $context);
        $this->capture($part, OutputStream::Stdout, $result->stdout, $state);
        $this->capture($part, OutputStream::Stderr, $result->stderr, $state);
        $state->events->ended($part, PartEnd::exited($result->status), true);

        return new StepOutcome($result->status, $result->context, $result->stdout);
    }

    /**
     * Starts an external part from its argv after its intent is stored; a part that cannot start is SpawnFailed and its
     * reason is returned.
     *
     * @param  array<int, string>  $values
     * @param  array<int, string>  $input
     */
    private function spawn(PartKey $part, PlanStep $step, array $values, ExecutionContext $context, RunState $state, array $input): SpawnedProcess|string
    {
        $descriptors = [0 => $input, 1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
        foreach ($step->redirects as $redirect) {
            $descriptors[$redirect->descriptor] = $this->descriptor($redirect, $values, $context);
        }
        $environment = array_diff_key([...$context->environment, ...array_map(fn (PlanWord $word) => $this->text($word, $values), $step->assignments)], array_flip(self::SECRET_VARIABLES));
        $argv = array_map(fn (PlanWord $word) => $this->text($word, $values), $step->argv);
        $process = SpawnedProcess::start($argv, $descriptors, $context->workingFolder, $environment);
        if (is_string($process)) {
            $state->events->spawnFailed($part, $process);

            return $process;
        }
        $state->events->started($part, $process->pid, gethostname() ?: 'unknown');

        return $process;
    }

    /**
     * Ends an external part: stopped when a stop was requested, otherwise drained and ended with its own status. It
     * returns the status the next branch decides on.
     */
    private function finishExternal(PartKey $part, SpawnedProcess $process, RunState $state, bool $drained = true): int
    {
        if ($state->stop->isRequested() && ! $process->hasEnded()) {
            if ($process->stopGroup(self::STOP_GRACE_SECONDS)) {
                $state->events->stopped($part, $state->stop->reason());
            } else {
                $state->events->lost($part);
            }

            return 130;
        }
        $process->drain(fn (OutputStream $stream, string $bytes) => $state->events->output($part, $stream, $bytes));
        $end = $process->wait();
        $state->events->ended($part, $end, $drained);

        return $this->branchStatus($end);
    }

    /**
     * @param  array<int, string>  $values
     * @return array<int, string|int>
     */
    private function descriptor(PlanRedirect $redirect, array $values, ExecutionContext $context): array
    {
        $target = $this->text($redirect->target, $values);
        $path = str_starts_with($target, '/') ? $target : rtrim($context->workingFolder, '/').'/'.$target;

        return match ($redirect->type) {
            RedirectType::Output, RedirectType::Clobber => ['file', $path, 'w'],
            RedirectType::Append => ['file', $path, 'a'],
            RedirectType::Input => ['file', $path, 'r'],
            RedirectType::DuplicateOutput => ['redirect', (int) $target],
            default => throw SupervisorRefused::unsupportedRedirect($redirect->type->value),
        };
    }

    /**
     * The status the next branch decides on; the stored end keeps a signal as a signal.
     */
    private function branchStatus(PartEnd $end): int
    {
        return match ($end->type) {
            PartEndType::Exited => $end->code,
            PartEndType::Signalled => 128 + $end->code,
            PartEndType::NotYet, PartEndType::Unavailable => 1,
        };
    }

    private function capture(PartKey $part, OutputStream $stream, string $bytes, RunState $state): void
    {
        if ($bytes !== '') {
            $state->events->output($part, $stream, $bytes);
        }
    }

    private function queued(PlanStep $step, RunState $state): PartKey
    {
        $part = new PartKey($step->node, $state->nextAttempt($step->node), (string) ($step->argv[0] ?? null)?->literal());
        $state->events->queued($part);

        return $part;
    }

    /**
     * @param  array<int, string>  $values
     */
    private function text(PlanWord $word, array $values): string
    {
        return implode('', array_map(fn (string|int $piece) => is_int($piece) ? $values[$piece] : $piece, $word->pieces));
    }
}
