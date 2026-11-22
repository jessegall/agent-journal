<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ScreenReportRefusal;
use JsonSerializable;

/**
 * What the journal answers a host's screen frame: stored, or refused with a short reason.
 */
final readonly class ScreenReportAnswer implements JsonSerializable
{
    public function __construct(public ScreenReportRefusal|null $refusal) {}

    public static function stored(): self
    {
        return new self(null);
    }

    public static function refused(ScreenReportRefusal $refusal): self
    {
        return new self($refusal);
    }

    public function isStored(): bool
    {
        return $this->refusal === null;
    }

    /**
     * @return array{status: string, reason?: string}
     */
    public function jsonSerialize(): array
    {
        if ($this->refusal === null) {
            return ['status' => 'stored'];
        }

        return ['status' => 'refused', 'reason' => $this->refusal->value];
    }
}
