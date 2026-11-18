<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Admission\OutputPolicy;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ProcessRunner;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\OutputHiddenRefused;
use App\Processes\Exceptions\RunnerUnavailable;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\AdmittedRun;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\RunReceipt;

/**
 * Starts an admitted run (doc 21 revision 6, sections 53 and 55): it refuses while the host capability is off,
 * checks the admitted line against its digests and plan, refuses hidden output again, and stores the run that
 * process:run then executes. Its receipt says the run started, never how it ended.
 */
final readonly class SupervisedRunner implements ProcessRunner
{
    public function __construct(
        private RunnerCapability $capability,
        private ShellSyntax $syntax,
        private CommandClassifier $classifier,
        private ExecutionPlanner $planner,
        private OutputPolicy $outputs,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws RunnerUnavailable
     * @throws OutputHiddenRefused
     */
    public function start(AdmittedRun $run): RunReceipt
    {
        if (! $this->capability->isOn()) {
            throw RunnerUnavailable::switchedOff();
        }
        $context = new ExecutionContext(ShellDialect::Bash, $run->workingFolder, $run->workingFolder);
        $tree = $this->syntax->parse($run->source, ShellDialect::Bash);
        $classification = $this->classifier->classify($tree, $context);
        $planned = $this->planner->plan($tree, $classification)->treeDigest;
        $sameSource = hash_equals($run->sourceDigest, hash('sha256', $run->source));
        if (! $sameSource || ! hash_equals($run->plan->treeDigest, $planned)) {
            throw RunnerUnavailable::changedAdmission();
        }
        $verdict = $this->outputs->check($classification);
        if (! $verdict->isAllowed()) {
            throw OutputHiddenRefused::by($verdict);
        }
        $stored = ProcessRun::admit($run->actor, [
            'admission_id' => $run->admissionId,
            'mode' => $run->mode,
            'project_key' => $this->projects->current(),
            'source_digest' => $run->sourceDigest,
            'dialect' => ShellDialect::Bash,
            'tree_digest' => $run->plan->treeDigest,
            'registry_revision' => $run->registryRevision,
            'policy_revision' => $run->policyRevision,
            'working_folder' => $run->workingFolder,
            'plan' => $run->plan->toArray(),
        ]);

        return new RunReceipt($stored->id, 0, $stored->lifecycle);
    }
}
