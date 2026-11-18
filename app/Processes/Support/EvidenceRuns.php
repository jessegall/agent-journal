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
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionContext;

/**
 * Issues evidence permits for known command lines and turns a used permit into an evidence-only run (doc 21 revision
 * 6, section 71): the exact line is read and classified again, must keep its full output, and becomes a run admitted
 * in evidence mode that never answers the agent. The run's admission id is the permit's, so a second start of the
 * same permit fails on that unique key.
 */
final readonly class EvidenceRuns
{
    public function __construct(
        private ShellSyntax $syntax,
        private CommandClassifier $classifier,
        private ExecutionPlanner $planner,
        private OutputPolicy $outputs,
        private CommandPermissionReader $permissions,
    ) {}

    /**
     * @throws EvidencePermitRefused
     */
    public function issue(string $line, string $workingFolder, ActorIdentity $runner, int $byteCap, int $secondsCap, int $minutesValid): EvidencePermit
    {
        $classification = $this->classify($line, $workingFolder);
        if (! $classification->isKnown()) {
            throw EvidencePermitRefused::unknown();
        }
        $permissions = $this->permissions->forActor($runner);
        foreach ($classification->parts as $part) {
            if (! $permissions->admits($classification->requiredClasses(), $classification->argvOf($part))) {
                throw EvidencePermitRefused::beyondRole();
            }
        }

        return EvidencePermit::issue(
            $workingFolder,
            $line,
            $classification,
            $this->digestOf($classification),
            $runner,
            $byteCap,
            $secondsCap,
            $minutesValid,
        );
    }

    /**
     * The evidence run of a permit, started once: the same request id returns the run it already made.
     *
     * @throws EvidencePermitRefused
     */
    public function start(EvidencePermit $permit, ActorIdentity $runner, string $requestId): ProcessRun
    {
        $classification = $this->classify($permit->source_line, $permit->working_folder);
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

    private function classify(string $line, string $workingFolder): Classification
    {
        $tree = $this->syntax->parse($line, ShellDialect::Bash);
        if ($tree->outcome !== ParseOutcome::Complete) {
            throw EvidencePermitRefused::unknown();
        }

        return $this->classifier->classify($tree, ExecutionContext::inFolder($workingFolder));
    }

    private function digestOf(Classification $classification): string
    {
        return hash('sha256', json_encode($classification->summary(), JSON_THROW_ON_ERROR));
    }
}
