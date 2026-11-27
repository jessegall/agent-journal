<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Access\Exceptions\AdmissionStartedNoRun;
use App\Values\AdmissionRefusal;

/**
 * One shell admission's decision for a whole line: the admitted run with the id of its queued run, or the refusal
 * that started nothing.
 */
final readonly class Admission
{
    private function __construct(
        public AdmittedRun|AdmissionRefusal $decision,
        private string|null $queuedRunId,
    ) {}

    public static function allowed(AdmittedRun $run, string $runId): self
    {
        return new self($run, $runId);
    }

    public static function refused(AdmissionRefusal $refusal): self
    {
        return new self($refusal, null);
    }

    public function isAllowed(): bool
    {
        return $this->decision instanceof AdmittedRun;
    }

    /**
     * The id of the run the admission queued.
     *
     * @throws AdmissionStartedNoRun
     */
    public function runId(): string
    {
        return $this->queuedRunId ?? throw AdmissionStartedNoRun::refused();
    }
}
