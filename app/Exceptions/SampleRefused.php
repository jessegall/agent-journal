<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An evidence sample for a request cannot be approved, started or settled now; the message names the next step.
 */
final class SampleRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function otherCommand(string $requestId): self
    {
        return new self("The command digest is not the line request {$requestId} holds; approve that exact line.");
    }

    public static function declarationMissing(string $requestId, int $revision): self
    {
        return new self("Request {$requestId} has no proposed declaration at revision {$revision}.");
    }

    public static function stale(string $requestId, int $expected, int $current): self
    {
        return new self("Request {$requestId}'s declaration is at revision {$current}, not {$expected}.");
    }

    public static function effectsUnknown(string $requestId): self
    {
        return new self("Request {$requestId}'s declaration names no effects, so it cannot be approved for a sample.");
    }

    public static function notReady(string $nextStep): self
    {
        return new self("No sample may run yet: {$nextStep}");
    }

    public static function stillRunning(string $runId): self
    {
        return new self("Sample run {$runId} has not ended yet; settle it once it has.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
