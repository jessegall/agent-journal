<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One item of a host's protection report: whether the pinned client keeps its tools from it there, the native run
 * that showed it, or why it is not kept.
 */
final readonly class ProtectedItem
{
    public const string EVIDENCE_MISSING = 'native evidence missing';

    public function __construct(
        public string $item,
        public bool $isEnforced,
        public string $evidence,
        public string $reason,
    ) {}

    /**
     * Whether the pinned client has a native mechanism for this item and only the recorded run that shows it hold is
     * missing, as the host words it (tools/journal-agent/host/protection.go, judgeItem).
     */
    public function awaitsEvidenceOnly(): bool
    {
        return ! $this->isEnforced && str_starts_with($this->reason, self::EVIDENCE_MISSING);
    }
}
