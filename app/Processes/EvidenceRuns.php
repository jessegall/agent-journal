<?php

declare(strict_types=1);

namespace App\Processes;

use App\Access\OutputPolicy;
use App\Actors\Contracts\AgentTexts;
use App\Bus\Contracts\CommandClassifier;
use App\Bus\Contracts\CommandPermissionResolver;
use App\CommandRules\Enums\ParseOutcome;
use App\CommandRules\Exceptions\EvidencePermitRefused;
use App\CommandRules\Values\PermitLimits;
use App\CommandRules\Values\PermittedLine;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\ProcessRun;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\RunRequestIntent;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\PhaseTimingRefused;
use App\Projects\SelectedProject;
use App\Support\ActorReference;
use App\Support\Syntax\TreeParser;
use App\Time\Contracts\VerificationTiming;
use App\Time\Values\TimingVerdict;
use App\Values\Classification;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\RunAdmission;

/**
 * Issues evidence permits for known command lines and turns a used permit into an evidence-only run: the exact line
 * is read and classified again, must keep its full output, and becomes a run admitted in evidence mode that never
 * answers the agent. The run's admission id is the permit's, so a second start of the
 * same permit fails on that unique key.
 */
final readonly class EvidenceRuns
{
    public function __construct(
        private TreeParser $syntax,
        private CommandClassifier $classifier,
        private ExecutionPlanner $planner,
        private OutputPolicy $outputs,
        private CommandPermissionResolver $permissions,
        private SelectedProject $projects,
        private VerificationTiming $timing,
        private AgentTexts $texts,
    ) {}

    /**
     * @throws EvidencePermitRefused
     */
    public function issue(
        string $line,
        string $workingFolder,
        ActorReference $runner,
        PermitLimits $limits,
    ): EvidencePermit {
        $permitted = $this->permitted($line, $workingFolder, $runner, []);

        return EvidencePermit::create($this->projects->find(), $permitted, $runner, $limits, null, []);
    }

    /**
     * The permit for one sample of a request's exact line, classified with the declaration the owner approved for
     * sampling and run by the actor who opened the request, under the sample limits.
     *
     * @throws EvidencePermitRefused
     */
    public function issueForRequest(CommandRequest $request, CommandRule $proposed): EvidencePermit
    {
        $permitted = $this->permitted($request->source_line, $request->working_folder, $request->actor(), [$proposed]);

        return EvidencePermit::create(
            $request->project,
            $permitted,
            $request->actor(),
            PermitLimits::forSample(),
            $request,
            [$proposed],
        );
    }

    /**
     * The evidence run of a permit, started once: the same request id returns the run it already made; a fresh start
     * checks the runner's current permissions on every classified part first, so a permit issued before the runner's
     * authority narrowed starts nothing.
     *
     * @throws EvidencePermitRefused
     */
    public function start(EvidencePermit $permit, ActorReference $runner, string $requestId): ProcessRun
    {
        $classification = $this->classify(
            $permit->source_line,
            $permit->working_folder,
            $permit->candidate_rules->items(),
        );

        $permit->assertUsable($runner, $requestId, $this->digestOf($classification));

        if ($permit->wasStartedBy($requestId)) {
            return ProcessRun::findForAnyActor($permit->process_run_id);
        }

        $this->checkedClassification(
            $permit->source_line,
            $permit->working_folder,
            $runner,
            $permit->candidate_rules->items(),
        );

        $timing = $classification->hasVerification() ? $this->timing->forCaller() : TimingVerdict::allowed();

        if (! $timing->isAllowed()) {
            throw PhaseTimingRefused::by($timing, $this->texts);
        }

        $verdict = $this->outputs->check($classification);

        if (! $verdict->isAllowed()) {
            throw EvidencePermitRefused::changed();
        }

        $plan = $this->planner->plan($classification->tree, $classification);

        $run = ProcessRun::create($runner, new RunAdmission(
            "evidence-{$permit->id}",
            RunMode::Evidence,
            $permit->project_id,
            $permit->source_digest,
            ShellDialect::Bash,
            $permit->classification_digest,
            'evidence-permit',
            $permit->working_folder,
            $plan,
            RunRequestIntent::ScheduledCheck,
        ));

        $permit->consume($requestId, $run);

        return $run;
    }

    /**
     * @param  list<CommandRule>  $candidates
     *
     * @throws EvidencePermitRefused
     */
    private function checkedClassification(
        string $line,
        string $workingFolder,
        ActorReference $runner,
        array $candidates,
    ): Classification {
        $classification = $this->classify($line, $workingFolder, $candidates);

        if (! $classification->isKnown()) {
            throw EvidencePermitRefused::unknown();
        }

        $permissions = $this->permissions->forActor($runner);

        foreach ($classification->parts as $part) {
            if (! $permissions->admits($classification->requiredClasses(), $classification->argvOf($part))) {
                throw EvidencePermitRefused::beyondRole();
            }
        }

        return $classification;
    }

    /**
     * @param  list<CommandRule>  $candidates
     *
     * @throws EvidencePermitRefused
     */
    private function permitted(
        string $line,
        string $workingFolder,
        ActorReference $runner,
        array $candidates,
    ): PermittedLine {
        $classification = $this->checkedClassification($line, $workingFolder, $runner, $candidates);
        $classes = array_map(fn ($class) => $class->value, $classification->requiredClasses()->classes);

        return new PermittedLine($line, $workingFolder, $this->digestOf($classification), $classes);
    }

    /**
     * @param  list<CommandRule>  $candidates
     *
     * @throws EvidencePermitRefused
     */
    private function classify(string $line, string $workingFolder, array $candidates): Classification
    {
        $tree = $this->syntax->parse($line, ShellDialect::Bash);

        if ($tree->outcome !== ParseOutcome::Complete) {
            throw EvidencePermitRefused::unknown();
        }

        $classifier = array_reduce(
            $candidates,
            fn (CommandClassifier $known, CommandRule $rule) => $known->withCandidate($rule),
            $this->classifier,
        );

        return $classifier->classify($tree, ExecutionContext::inFolder($workingFolder));
    }

    private function digestOf(Classification $classification): string
    {
        return hash('sha256', json_encode($classification->summary(), JSON_THROW_ON_ERROR));
    }
}
