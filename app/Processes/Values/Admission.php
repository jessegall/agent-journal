<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * One shell admission's decision for a whole line: the admitted run with the id of its queued run, or the refusal
 * that started nothing.
 */
final readonly class Admission
{
    private function __construct(public AdmittedRun|AdmissionRefusal $decision, public string $runId) {}

    public static function allowed(AdmittedRun $run, string $runId): self
    {
        return new self($run, $runId);
    }

    public static function refused(AdmissionRefusal $refusal): self
    {
        return new self($refusal, '');
    }

    public function isAllowed(): bool
    {
        return $this->decision instanceof AdmittedRun;
    }
}
