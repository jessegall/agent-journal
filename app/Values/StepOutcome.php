<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\StepStatus;

final readonly class StepOutcome
{
    private function __construct(
        public StepStatus $status,
        public string|null $port,
        public string|null $evidence,
    ) {}

    public static function completed(string $port, string|null $evidence = null): self
    {
        return new self(StepStatus::Completed, $port, $evidence);
    }

    public static function failed(string $diagnostic): self
    {
        return new self(StepStatus::Failed, 'failure', $diagnostic);
    }

    public static function pending(string $reference): self
    {
        return new self(StepStatus::Pending, null, $reference);
    }

    /**
     * The outcome a host reported for a step it ran or read.
     */
    public static function reported(StepStatus $status, string|null $port, string|null $evidence): self
    {
        return new self($status, $port, $evidence);
    }

    public static function uncertain(string $evidence): self
    {
        return new self(StepStatus::Uncertain, null, $evidence);
    }
}
