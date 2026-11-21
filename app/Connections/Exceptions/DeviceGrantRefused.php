<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A device grant step that does not go on: an unknown or expired code, a poll before the owner approved or sooner
 * than allowed, a grant that is revoked or expired, or one whose approving user the journal no longer admits.
 */
final class DeviceGrantRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private int $status = 404;

    private RefusalCode $refusalCode = RefusalCode::RecordUnavailable;

    public static function unknownCode(): self
    {
        return new self('This device code is unknown or expired. Run the journal command again for a new one.');
    }

    public static function awaitingApproval(): self
    {
        $refusal = new self('The owner has not approved this device yet.');
        $refusal->status = 428;
        $refusal->refusalCode = RefusalCode::StateBlocked;

        return $refusal;
    }

    public static function pollingTooFast(): self
    {
        $refusal = new self('Poll this device code at most once every five seconds.');
        $refusal->status = 429;
        $refusal->refusalCode = RefusalCode::Busy;

        return $refusal;
    }

    public static function notUsable(): self
    {
        $refusal = new self('This device grant is revoked or expired. Run the journal command again to approve a new one.');
        $refusal->status = 401;
        $refusal->refusalCode = RefusalCode::Unauthenticated;

        return $refusal;
    }

    public static function approverWithdrawn(): self
    {
        $refusal = new self(
            'The user who approved this terminal can no longer use the journal. Ask an owner to approve it again.',
        );
        $refusal->status = 403;
        $refusal->refusalCode = RefusalCode::Forbidden;

        return $refusal;
    }

    public function refusalCode(): RefusalCode
    {
        return $this->refusalCode;
    }

    protected function status(): int
    {
        return $this->status;
    }
}
