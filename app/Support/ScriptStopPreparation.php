<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Scripts\ProfileScripts;
use App\Contracts\Scripts\ScriptChecks;
use App\Enums\Profiles\ProfileRunState;
use App\Models\Profiles\ProfileRun;
use App\Models\Profiles\ProfileStepResult;
use App\Values\AgentText;
use App\Values\CompiledScript;
use App\Values\Instruction;
use App\Values\ProfileKey;
use App\Values\ProfileRevisionReference;
use App\Values\ProfileScript;
use App\Values\RunContext;
use App\Values\ScriptContext;
use App\Values\StepOutcome;
use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;
use App\Values\TriggerPolicy;
use App\Values\WorkspaceReadReference;
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
    /**
     * How many returns in a row on an unchanged workspace hold the work.
     */
    public const int UNCHANGED_RETURN_LIMIT = 3;

    private const string TRIGGER = 'STOP';

    private const string ENTRY_READ = 'entry';

    public function __construct(
        private ProfileScripts $profiles,
        private ScriptChecks $checks,
        private KeywordRegistry $keywords,
        private ObjectReader $reader,
        private AgentTexts $texts,
    ) {}

    public function prepare(StopPreparationRequest $request): StopPreparation
    {
        $profile = ProfileKey::from($request->profileKey);
        $script = $this->profiles->scriptAt($profile, $request->profileRevision);

        if (! $script->handles(self::TRIGGER)) {
            return StopPreparation::finalChecks();
        }

        $run = ProfileRun::create(
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

        $driver = $this->currentDriver($script);

        if ($driver->isEmpty()) {
            return $this->hold($run, AgentText::of('core.stop.definitions_changed'), $run->unchanged_returns);
        }

        return $this->go($run, $driver->get(), $request);
    }

    /**
     * The script compiled under the definitions registered now, when that gives the driver it was activated with;
     * a definition that changed or is no longer available gives none.
     *
     * @return Option<CompiledScript>
     */
    private function currentDriver(ProfileScript $script): Option
    {
        $current = $this->checks->check($script->source)->compiled;

        if ($current !== null && $current->definitionDigest === $script->compiled->definitionDigest) {
            return new Some($current);
        }

        return None::create();
    }

    private function go(ProfileRun $run, CompiledScript $driver, StopPreparationRequest $request): StopPreparation
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
        $handler = $driver->graph['handlers'][self::TRIGGER];
        /**
         * @var array<string, Instruction> $instructions
         */
        $instructions = $driver->graph['instructions'];
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

        if ($unchangedReturns >= self::UNCHANGED_RETURN_LIMIT) {
            $reason = AgentText::of('core.stop.unchanged_returns', ['evidence' => $evidence]);

            return $this->hold($run, $reason, $unchangedReturns);
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
            $this->texts,
        );

        return $this->keywords->statementFor($instruction->keyword)->execute($instruction, new RunContext($execution));
    }

    /**
     * Suspends the run on a line: a host read or command is still owed there, or its outcome is not known yet.
     */
    private function suspend(ProfileRun $run, int $line, StepOutcome $outcome): StopPreparation
    {
        $run->suspendOn($line, (string) $outcome->evidence);

        return StopPreparation::preparing();
    }

    /**
     * Holds the work; the owner is told only when it becomes held, not again while it stays held.
     */
    private function hold(ProfileRun $run, AgentText $reason, int $unchangedReturns): StopPreparation
    {
        $wasHeld = $run->followsHeldRun();
        $run->finish(ProfileRunState::Held, $this->texts->render($reason), $unchangedReturns);

        return $this->answer($run, tellsOwner: ! $wasHeld);
    }

    private function answer(ProfileRun $run, bool $tellsOwner): StopPreparation
    {
        return match ($run->state) {
            ProfileRunState::Running, ProfileRunState::Suspended => StopPreparation::preparing(),
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
