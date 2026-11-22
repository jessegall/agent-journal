<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An install line that cannot be used: unknown, expired, spent or revoked. Every one of these answers alike, so the
 * answer never tells which.
 */
final class InvitationUnusable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forTicket(): self
    {
        return new self('This install line cannot be used.');
    }

    public static function forId(string $invitationId): self
    {
        return new self("The install line {$invitationId} is not pending.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }

    protected function status(): int
    {
        return 404;
    }
}
