<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Enums\AutoAssignmentClaimType;
use App\Records\Support\RecordIdentity;

final readonly class AutoAssignmentOutcome
{
    private function __construct(
        public AutoAssignmentClaimType $type,
        public RecordIdentity|null $record = null,
    ) {}

    public static function assigned(RecordIdentity $record): self
    {
        return new self(AutoAssignmentClaimType::Assigned, $record);
    }

    public static function unchanged(): self
    {
        return new self(AutoAssignmentClaimType::Unchanged);
    }

    public static function full(): self
    {
        return new self(AutoAssignmentClaimType::Full);
    }

    public static function noCandidate(): self
    {
        return new self(AutoAssignmentClaimType::NoCandidate);
    }

    public static function unavailable(): self
    {
        return new self(AutoAssignmentClaimType::Unavailable);
    }

    public static function off(): self
    {
        return new self(AutoAssignmentClaimType::Off);
    }

    public function isAssigned(): bool
    {
        return $this->type === AutoAssignmentClaimType::Assigned;
    }
}
