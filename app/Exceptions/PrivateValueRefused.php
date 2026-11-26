<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A host asked for a private value it may not have: one never ordered written on it, or one already pulled or gone.
 */
final class PrivateValueRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notOrderedFor(string $submissionId, string $hostId): self
    {
        return new self("No write of private submission {$submissionId} was ordered on host {$hostId}.");
    }

    public static function gone(string $submissionId): self
    {
        return new self("The value of private submission {$submissionId} was already pulled or is gone.");
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
