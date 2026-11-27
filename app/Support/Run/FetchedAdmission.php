<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Api\Processes\AdmissionAlreadyStarted;
use App\Api\Processes\AdmissionFetched;
use App\Api\Processes\StartableAdmission;
use App\Exceptions\AdmissionAnswerUnknown;
use App\Exceptions\AdmittedPlanChanged;
use App\Files\Enums\Place;
use App\Values\ExecutionContext;
use App\Values\ExecutionPlan;
use App\Values\FilePath;

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
        private StartableAdmission|null $startable,
        public array $environment,
    ) {}

    /**
     * @param  array<string, string>  $environment
     */
    public static function fromAnswer(AdmissionFetched $answer, array $environment): self
    {
        if (! $answer instanceof StartableAdmission) {
            return new self(self::runOf($answer), null, $environment);
        }

        return new self($answer->runId, $answer, $environment);
    }

    private static function runOf(AdmissionFetched $answer): string
    {
        if ($answer instanceof AdmissionAlreadyStarted) {
            return $answer->runId;
        }

        throw AdmissionAnswerUnknown::for($answer::class);
    }

    public function isAlreadyStarted(): bool
    {
        return $this->startable === null;
    }

    public function planMatches(): bool
    {
        if ($this->startable === null) {
            return false;
        }

        return hash_equals($this->startable->treeDigest, $this->startable->plan->treeDigest);
    }

    /**
     * @throws AdmittedPlanChanged when the journal handed out no plan
     */
    public function plan(): ExecutionPlan
    {
        return $this->startable()->plan;
    }

    /**
     * @throws AdmittedPlanChanged when the journal handed out no dialect to run in
     */
    public function context(): ExecutionContext
    {
        $startable = $this->startable();

        return new ExecutionContext(
            $startable->dialect,
            $startable->workingFolder,
            $startable->workingFolder,
            $this->environment,
        );
    }

    /**
     * The key the run's events are reported under.
     *
     * @throws AdmittedPlanChanged when the journal handed out no run to start
     */
    public function eventKey(): string
    {
        return $this->startable()->eventKey;
    }

    public function spoolFolder(): FilePath
    {
        return FilePath::in(Place::Temporary, "journal-runs/{$this->runId}");
    }

    /**
     * @throws AdmittedPlanChanged
     */
    private function startable(): StartableAdmission
    {
        return $this->startable ?? throw AdmittedPlanChanged::forRun($this->runId);
    }
}
