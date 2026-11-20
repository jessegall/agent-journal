<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Actors\Support\ActorIdentity;
use App\Processes\Admission\OutputPolicy;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\EvidencePermitRefused;
use App\Processes\Exceptions\PhaseTimingRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\ProcessRun;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PermitLimits;
use App\Processes\Values\PermittedLine;
use App\Processes\Values\RunAdmission;
use App\Processes\Values\TimingVerdict;

/**
 * Issues evidence permits for known command lines and turns a used permit into an evidence-only run (doc 21 revision
 * 6, section 71): the exact line is read and classified again, must keep its full output, and becomes a run admitted
 * in evidence mode that never answers the agent. The run's admission id is the permit's, so a second start of the
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
        private ProjectKey $projects,
        private VerificationTiming $timing,
    ) {}

    /**
     * @throws EvidencePermitRefused
     */
    public function issue(
        string $line,
        string $workingFolder,
        ActorIdentity $runner,
        PermitLimits $limits,
    ): EvidencePermit {
        $permitted = $this->permitted($line, $workingFolder, $runner, []);

        return EvidencePermit::issue($this->projects->current(), $permitted, $runner, $limits);
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

        return EvidencePermit::forRequest($request, $permitted, $proposed, PermitLimits::forSample());
    }

    /**
     * The evidence run of a permit, started once: the same request id returns the run it already made; a fresh start
     * checks the runner's current permissions on every classified part first, so a permit issued before the runner's
     * authority narrowed launches nothing.
     *
     * @throws EvidencePermitRefused
     */
    public function start(EvidencePermit $permit, ActorIdentity $runner, string $requestId): ProcessRun
    {
        $classification = $this->classify($permit->source_line, $permit->working_folder, $permit->candidate_rules);
        $permit->assertUsable($runner, $requestId, $this->digestOf($classification));

        if ($permit->wasStartedBy($requestId)) {
            return ProcessRun::ofAnyActor($permit->process_run_id);
        }
        $this->checkedClassification(
            $permit->source_line,
            $permit->working_folder,
            $runner,
            $permit->candidate_rules,
        );
        $timing = $classification->hasVerification() ? $this->timing->forCaller() : TimingVerdict::allowed();

        if (! $timing->isAllowed()) {
            throw PhaseTimingRefused::by($timing);
        }
        $verdict = $this->outputs->check($classification);

        if (! $verdict->isAllowed()) {
            throw EvidencePermitRefused::changed();
        }
        $plan = $this->planner->plan($classification->tree, $classification);
        $run = ProcessRun::admit($runner, new RunAdmission(
            "evidence-{$permit->id}",
            RunMode::Evidence,
            $permit->project_key,
            $permit->source_digest,
            ShellDialect::Bash,
            $permit->classification_digest,
            'evidence-permit',
            $permit->working_folder,
            $plan,
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
        ActorIdentity $runner,
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
        ActorIdentity $runner,
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
            fn (CommandClassifier $known, CommandRule $rule): CommandClassifier => $known->withCandidate($rule),
            $this->classifier,
        );

        return $classifier->classify($tree, ExecutionContext::inFolder($workingFolder));
    }

    private function digestOf(Classification $classification): string
    {
        return hash('sha256', json_encode($classification->summary(), JSON_THROW_ON_ERROR));
    }
}
