<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Drivers\BoundaryItem;

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
     * The item judged from its mechanism and the run that showed it hold: no native mechanism is refused with why, a
     * native one with no recorded run awaits its evidence, and one with a run is enforced.
     */
    public static function judged(BoundaryItem $item, BoundaryMechanism $mechanism, string $evidenceRun): self
    {
        if (! $mechanism->isNative) {
            return new self($item->value, false, '', "no native mechanism: {$mechanism->text}");
        }

        if ($evidenceRun === '') {
            $reason = self::EVIDENCE_MISSING.': no recorded run showed it hold on this host';

            return new self($item->value, false, '', $reason);
        }

        return new self($item->value, true, $evidenceRun, '');
    }

    /**
     * Whether the pinned client has a native mechanism for this item and only the recorded run that shows it hold is
     * missing.
     */
    public function awaitsEvidenceOnly(): bool
    {
        return ! $this->isEnforced && str_starts_with($this->reason, self::EVIDENCE_MISSING);
    }
}
