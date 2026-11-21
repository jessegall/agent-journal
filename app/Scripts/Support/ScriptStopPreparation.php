<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Agents\Values\WorkspaceReadReference;
use App\Hooks\Contracts\StopPreparer;
use App\Hooks\Values\StopPreparation;
use App\Hooks\Values\StopPreparationRequest;
use App\Profiles\Contracts\ProfileScripts;
use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileRevisionReference;
use App\Profiles\Values\ProfileScript;
use App\Scripts\Contracts\ScriptChecks;
use App\Scripts\Enums\ProfileRunState;
use App\Scripts\Models\ProfileRun;
use App\Scripts\Models\ProfileStepResult;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\RunContext;
use App\Scripts\Values\ScriptContext;
use App\Scripts\Values\StepOutcome;
use App\Scripts\Values\TriggerPolicy;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Prepares a stop by the STOP handler of the profile's script: one run per stop, continued by the next stop while it
 * waits on the host, that admits the stop to the final checks when the script falls through and hands it back to the
 * actor on a YIELD or a failure. Every run walks the script from its entry and replays the steps it recorded, so a
 * step never runs twice. Three returns in a row on an unchanged workspace hold the work, as does a script whose
 * definitions changed since it was activated; the owner is told once, when the work becomes held.
 */
final readonly class ScriptStopPreparation implements StopPreparer
{
    public const string PREPARING = 'The STOP script waits for the host; the job stays open until it reports, and you '
        .'are woken to stop again.';

    public const string DEFINITIONS_CHANGED = 'The STOP script uses a definition that changed or is no longer '
        .'available since the profile was activated, so the job is held and your parent is told.';

    public const string RETURNS_HELD = 'The STOP script sent the stop back three times with no change in the '
        .'workspace, so the job is held for repair and your parent is told.';

    /**
     * How many returns in a row on an unchanged workspace hold the work.
     */
    public const int UNCHANGED_RETURNS_TO_HOLD = 3;

    private const string TRIGGER = 'STOP';

    private const string ENTRY_READ = 'entry';

    public function __construct(
        private ProfileScripts $profiles,
        private ScriptChecks $checks,
        private KeywordRegistry $keywords,
        private ObjectReader $reader,
    ) {}

    public function prepare(StopPreparationRequest $request): StopPreparation
    {
        $scripts = $this->profiles->scriptAt(ProfileKey::from($request->profileKey), $request->profileRevision)
            ->filter(fn (ProfileScript $script) => isset($script->compiled->graph['handlers'][self::TRIGGER]));

        if ($scripts->isEmpty()) {
            return StopPreparation::finalChecks();
        }

        $script = $scripts->get();
        $run = ProfileRun::forTrigger(
            $request->actor,
            $request->work,
            $request->profileKey,
            $request->profileRevision,
            $script->compiled->definitionDigest,
            $request->trigger,
        );

        if (! $run->state->isUnfinished()) {
            return $this->answer($run, tellsOwner: false);
        }

        $program = $this->currentProgram($script);

        if ($program->isEmpty()) {
            return $this->hold($run, self::DEFINITIONS_CHANGED, $run->unchanged_returns);
        }

        return $this->go($run, $program->get(), $request);
    }

    /**
     * The script compiled under the definitions registered now, when that gives the program it was activated with;
     * a definition that changed or is no longer available gives none.
     *
     * @return Option<CompiledScript>
     */
    private function currentProgram(ProfileScript $script): Option
    {
        $current = $this->checks->check($script->source)->compiled;

        return $current !== null && $current->definitionDigest === $script->compiled->definitionDigest
            ? new Some($current)
            : None::create();
    }

    private function go(ProfileRun $run, CompiledScript $program, StopPreparationRequest $request): StopPreparation
    {
        if ($run->generation === null) {
            $entry = $this->context($run, $request, self::ENTRY_READ);
            $generation = $this->reader->read('workspace', 'generation', $entry);

            if ($generation->unread !== null) {
                return $this->suspend($run, 0, $generation->unread);
            }

            $run->startOn((int) $generation->value);
        }

        $unchanged = $run->previous()->filter(fn (ProfileRun $previous) => $previous->generation === $run->generation);

        $held = $unchanged->filter(fn (ProfileRun $previous) => $previous->state === ProfileRunState::Held);

        if ($held->isDefined()) {
            $run->finish(ProfileRunState::Held, (string) $held->get()->message, $held->get()->unchanged_returns);

            return $this->answer($run, tellsOwner: false);
        }

        /**
         * @var array{entry: string, policy: TriggerPolicy} $handler
         */
        $handler = $program->graph['handlers'][self::TRIGGER];
        /**
         * @var array<string, Instruction> $instructions
         */
        $instructions = $program->graph['instructions'];
        $next = $handler['entry'];
        $evidence = '';

        while (isset($instructions[$next])) {
            $instruction = $instructions[$next];
            $step = "{$run->id}:{$next}";
            $outcome = $run->outcomeOf($step)->getOrCall(fn () => $this->take($instruction, $run, $request, $next));

            if ($outcome->status->isUnresolved()) {
                return $this->suspend($run, $instruction->source->line, $outcome);
            }

            if (! $run->hasRecordedStep($step)) {
                ProfileStepResult::create($run, $step, $outcome);
            }

            $evidence = (string) $outcome->evidence;
            $next = $instruction->successors[(string) $outcome->port];
        }

        if ($next === $handler['policy']->fallthrough) {
            $run->finish(ProfileRunState::FinalChecks, '', 0);

            return StopPreparation::finalChecks();
        }

        $unchangedReturns = $unchanged
            ->map(fn (ProfileRun $previous) => $previous->unchanged_returns + 1)
            ->getOrElse(1);

        if ($unchangedReturns >= self::UNCHANGED_RETURNS_TO_HOLD) {
            return $this->hold($run, self::RETURNS_HELD.PHP_EOL.$evidence, $unchangedReturns);
        }

        $run->finish(ProfileRunState::Returned, $evidence, $unchangedReturns);

        return StopPreparation::returnToActor($evidence);
    }

    private function take(
        Instruction $instruction,
        ProfileRun $run,
        StopPreparationRequest $request,
        string $instructionId,
    ): StepOutcome {
        $execution = new ProfileRunExecution(
            $this->reader,
            $this->context($run, $request, $instructionId),
            $request->access,
            "{$run->id}:{$instructionId}",
        );

        return $this->keywords->statementFor($instruction->keyword)->execute($instruction, new RunContext($execution));
    }

    /**
     * Suspends the run on a line: a host read or command is still owed there, or its outcome is not known yet.
     */
    private function suspend(ProfileRun $run, int $line, StepOutcome $outcome): StopPreparation
    {
        $run->suspendOn($line, (string) $outcome->evidence);

        return StopPreparation::preparing(self::PREPARING);
    }

    /**
     * Holds the work; the owner is told only when it becomes held, not again while it stays held.
     */
    private function hold(ProfileRun $run, string $message, int $unchangedReturns): StopPreparation
    {
        $wasHeld = $run->previous()
            ->filter(fn (ProfileRun $previous) => $previous->state === ProfileRunState::Held)
            ->isDefined();
        $run->finish(ProfileRunState::Held, $message, $unchangedReturns);

        return $this->answer($run, tellsOwner: ! $wasHeld);
    }

    private function answer(ProfileRun $run, bool $tellsOwner): StopPreparation
    {
        return match ($run->state) {
            ProfileRunState::Running, ProfileRunState::Suspended => StopPreparation::preparing(self::PREPARING),
            ProfileRunState::FinalChecks => StopPreparation::finalChecks(),
            ProfileRunState::Returned => StopPreparation::returnToActor((string) $run->message),
            ProfileRunState::Held => StopPreparation::held((string) $run->message, $tellsOwner),
        };
    }

    private function context(ProfileRun $run, StopPreparationRequest $request, string $read): ScriptContext
    {
        return new ScriptContext(
            $request->actor,
            $request->work,
            new ProfileRevisionReference(ProfileKey::from($run->profile_key), $run->profile_revision),
            $run->trigger_reference,
            new WorkspaceReadReference("{$run->id}:{$read}"),
        );
    }
}
