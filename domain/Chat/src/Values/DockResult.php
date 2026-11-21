<?php

declare(strict_types=1);

namespace Domain\Chat\Values;

use Domain\Chat\Enums\DockOutcome;

/**
 * The answer of a dock or an undock, the same over the browser, the journal and MCP: its outcome and, unless nothing
 * was there to act on, the placement.
 */
final readonly class DockResult
{
    private function __construct(public DockOutcome $outcome, public string|null $placementId) {}

    public static function of(DockOutcome $outcome, string $placementId): self
    {
        return new self($outcome, $placementId);
    }

    public static function unavailable(): self
    {
        return new self(DockOutcome::Unavailable, null);
    }
}
