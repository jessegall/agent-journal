<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Exceptions\AdmissionAnswerUnknown;
use App\Exceptions\AdmittedPlanChanged;
use App\Files\Enums\Place;
use App\Processes\Api\AdmissionAlreadyStarted;
use App\Processes\Api\AdmissionFetched;
use App\Processes\Api\StartableAdmission;
use App\Processes\Enums\ShellDialect;
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
        public bool $isAlreadyStarted,
        public ExecutionPlan|null $plan,
        public string $treeDigest,
        public string $workingFolder,
        public ShellDialect|null $dialect,
        public string $eventKey,
        public array $environment,
    ) {}

    /**
     * @param  array<string, string>  $environment
     */
    public static function fromAnswer(AdmissionFetched $answer, array $environment): self
    {
        if (! $answer instanceof StartableAdmission) {
            return new self(self::runOf($answer), true, null, '', '', null, '', $environment);
        }

        return new self(
            $answer->runId,
            false,
            $answer->plan,
            $answer->treeDigest,
            $answer->workingFolder,
            $answer->dialect,
            $answer->eventKey,
            $environment,
        );
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
        return $this->isAlreadyStarted;
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

    public function spoolFolder(): FilePath
    {
        return FilePath::in(Place::Temporary, "journal-runs/{$this->runId}");
    }
}
