<?php

declare(strict_types=1);

namespace App\Processes\Values\Run;

use App\Processes\Enums\AdmissionState;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\AdmittedPlanChanged;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ExecutionPlan;

/**
 * An admitted run as the journal hands it out once: its plan, the digest of the admitted tree, the folder and dialect
 * it runs in and the key its events are reported under.
 */
final readonly class FetchedAdmission
{
    /**
     * @param  array<string, string>  $environment
     */
    private function __construct(
        public string $runId,
        public bool $alreadyStarted,
        public ExecutionPlan|null $plan,
        public string $treeDigest,
        public string $workingFolder,
        public ShellDialect|null $dialect,
        public string $eventKey,
        public array $environment,
    ) {}

    /**
     * @param  array<string, mixed>  $answer
     * @param  array<string, string>  $environment
     */
    public static function fromAnswer(array $answer, array $environment): self
    {
        $runId = (string) $answer['run_id'];

        if (AdmissionState::from((string) $answer['state']) === AdmissionState::AlreadyStarted) {
            return new self($runId, true, null, '', '', null, '', $environment);
        }

        return new self(
            $runId,
            false,
            ExecutionPlan::fromArray($answer['plan']),
            (string) $answer['tree_digest'],
            (string) $answer['working_folder'],
            ShellDialect::from((string) $answer['dialect']),
            (string) $answer['event_key'],
            $environment,
        );
    }

    public function alreadyStarted(): bool
    {
        return $this->alreadyStarted;
    }

    public function planMatches(): bool
    {
        return $this->plan !== null && hash_equals($this->treeDigest, $this->plan->treeDigest);
    }

    /**
     * @throws AdmittedPlanChanged when the journal handed out no plan
     */
    public function plan(): ExecutionPlan
    {
        return $this->plan ?? throw AdmittedPlanChanged::forRun($this->runId);
    }

    /**
     * @throws AdmittedPlanChanged when the journal handed out no dialect to run in
     */
    public function context(): ExecutionContext
    {
        $dialect = $this->dialect ?? throw AdmittedPlanChanged::forRun($this->runId);

        return new ExecutionContext($dialect, $this->workingFolder, $this->workingFolder, $this->environment);
    }

    public function spoolFolder(): string
    {
        return sys_get_temp_dir().'/journal-runs/'.$this->runId;
    }
}
