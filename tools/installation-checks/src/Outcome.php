<?php

declare(strict_types=1);

namespace Tools\InstallationChecks;

/**
 * One item of a check: whether it passed, and why, in words that never hold a token or the canary.
 */
final readonly class Outcome
{
    public function __construct(public string $item, public bool $isPassed, public string $reason) {}

    public static function judged(string $item, bool $isPassed, string $reason): self
    {
        return new self($item, $isPassed, $reason);
    }

    public function line(): string
    {
        return sprintf('%s  %s: %s', $this->isPassed ? 'pass' : 'fail', $this->item, $this->reason);
    }

    /**
     * @return array{item: string, passed: bool, reason: string}
     */
    public function toArray(): array
    {
        return ['item' => $this->item, 'passed' => $this->isPassed, 'reason' => $this->reason];
    }
}
