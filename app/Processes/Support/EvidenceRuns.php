<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Actors\Support\ActorIdentity;
use App\Processes\Admission\OutputPolicy;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\CommandPermissionReader;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\EvidencePermitRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ExecutionContext;
use Carbon\CarbonImmutable;

/**
 * Issues evidence permits for known command lines and turns a used permit into an evidence-only run (doc 21 revision
 * 6, section 71): the exact line is read and classified again, must keep its full output, and becomes a run admitted
 * in evidence mode that never answers the agent. The run's admission id is the permit's, so a second start of the
 * same permit fails on that unique key.
 */
final readonly class EvidenceRuns
{
    private const int SAMPLE_BYTE_CAP = 104_857_600;

    private const int SAMPLE_SECONDS_CAP = 600;

    private const int SAMPLE_MINUTES_VALID = 60;

    public function __construct(
        private ShellSyntax $syntax,
        private CommandClassifier $classifier,
        private ExecutionPlanner $planner,
        private OutputPolicy $outputs,
        private CommandPermissionReader $permissions,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws EvidencePermitRefused
     */
    public function issue(
        string $line,
        string $workingFolder,
        ActorIdentity $runner,
        int $byteCap,
        int $secondsCap,
        int $minutesValid,
    ): EvidencePermit {
        $classification = $this->checkedClassification($line, $workingFolder, $runner, []);

        return EvidencePermit::query()->create([
            ...$this->permitFields($line, $workingFolder, $runner, $classification),
            'byte_cap' => $byteCap,
            'seconds_cap' => $secondsCap,
            'expires_at' => CarbonImmutable::now()->addMinutes($minutesValid),
            'candidate_rules' => [],
        ]);
    }

    /**
     * The permit for one sample of a request's exact line, classified with the declaration the owner approved for
     * sampling and run by the actor who opened the request, under the default capture limits.
     *
     * @throws EvidencePermitRefused
     */
    public function issueForRequest(CommandRequest $request, CommandRule $proposed): EvidencePermit
    {
        $runner = $request->opener();
        $line = $request->source_line;
        $classification = $this->checkedClassification($line, $request->working_folder, $runner, [$proposed]);

        return EvidencePermit::query()->create([
            ...$this->permitFields($line, $request->working_folder, $runner, $classification),
            'byte_cap' => self::SAMPLE_BYTE_CAP,
            'seconds_cap' => self::SAMPLE_SECONDS_CAP,
            'expires_at' => CarbonImmutable::now()->addMinutes(self::SAMPLE_MINUTES_VALID),
            'command_request_id' => $request->id,
            'candidate_rules' => [$proposed],
        ]);
    }

    /**
     * The evidence run of a permit, started once: the same request id returns the run it already made.
     *
     * @throws EvidencePermitRefused
     */
    public function start(EvidencePermit $permit, ActorIdentity $runner, string $requestId): ProcessRun
    {
        $classification = $this->classify($permit->source_line, $permit->working_folder, $permit->candidate_rules);
        $permit->checkUse($runner, $requestId, $this->digestOf($classification));
        if ($permit->wasStartedBy($requestId)) {
            return ProcessRun::query()->withoutGlobalScopes()->findOrFail($permit->process_run_id);
        }
        $verdict = $this->outputs->check($classification);
        if (! $verdict->isAllowed()) {
            throw EvidencePermitRefused::changed();
        }
        $plan = $this->planner->plan($classification->tree, $classification);
        $run = ProcessRun::admit($runner, [
            'admission_id' => "evidence-{$permit->id}",
            'mode' => RunMode::Evidence,
            'project_key' => $permit->project_key,
            'source_digest' => $permit->source_digest,
            'dialect' => ShellDialect::Bash,
            'tree_digest' => $plan->treeDigest,
            'registry_revision' => $permit->classification_digest,
            'policy_revision' => 'evidence-permit',
            'working_folder' => $permit->working_folder,
            'plan' => $plan->toArray(),
        ]);
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
     * @return array<string, mixed>
     */
    private function permitFields(
        string $line,
        string $workingFolder,
        ActorIdentity $runner,
        Classification $classification,
    ): array {
        return [
            'project_key' => $this->projects->current(),
            'working_folder' => $workingFolder,
            'source_line' => $line,
            'source_digest' => hash('sha256', $line),
            'classification_digest' => $this->digestOf($classification),
            'approved_classes' => array_map(fn ($class) => $class->value, $classification->requiredClasses()->classes),
            'runner_type' => $runner->type->value,
            'runner_id' => $runner->id,
        ];
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
