<?php

declare(strict_types=1);

namespace App\Projects\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * An install line that cannot be used: unknown, expired, spent or revoked. Every one of these answers alike, so the
 * answer never tells which.
 */
final class InvitationUnusable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<InvitationUnusable>
     */
    use ThrowsLater;

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
