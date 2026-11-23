<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Models\Projects\DeviceGrant;
use RuntimeException;
use Throwable;

/**
 * A device grant step that does not go on: an unknown or expired code, a poll before the owner approved or sooner
 * than allowed, a grant that is revoked or expired, or one whose approving user the journal no longer admits.
 */
final class DeviceGrantRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private int $status = 404;

    private RefusalCode $refusalCode = RefusalCode::RecordUnavailable;

    /**
     * The machine word a terminal acts on, and what it needs with it: the interval to wait, or the grant's reference.
     *
     * @var array<string, string|int>
     */
    private array $outcome = [];

    public static function unknownCode(): self
    {
        return new self('This device code is unknown or expired. Run the journal command again for a new one.');
    }

    public static function pollingTooFast(): self
    {
        $refusal = new self('Poll this device code at most once every five seconds.');
        $refusal->status = 429;
        $refusal->refusalCode = RefusalCode::Busy;
        $refusal->outcome = ['outcome' => 'slow_down', 'interval' => DeviceGrant::POLL_SECONDS_MINIMUM];

        return $refusal;
    }

    public static function notUsable(): self
    {
        $refusal = new self('This device grant is revoked or expired. Run the journal command again to approve a new one.');
        $refusal->status = 401;
        $refusal->refusalCode = RefusalCode::Unauthenticated;

        return $refusal;
    }

    public static function approverWithdrawn(Throwable $unavailable): self
    {
        $refusal = new self(
            'The user who approved this terminal can no longer use the journal. Ask an owner to approve it again.',
            previous: $unavailable,
        );

        $refusal->status = 403;
        $refusal->refusalCode = RefusalCode::Forbidden;

        return $refusal;
    }

    public static function expired(): self
    {
        $refusal = new self('This device code expired before the owner approved it. Run the journal command again for a new one.');
        $refusal->status = 410;
        $refusal->outcome = ['outcome' => 'expired_token'];

        return $refusal;
    }

    public static function alreadyIssued(string $reference): self
    {
        $refusal = new self(
            "Terminal sign-in {$reference} was already handed out once. Withdraw it in Settings if this terminal never got it.",
        );

        $refusal->status = 409;
        $refusal->refusalCode = RefusalCode::StateBlocked;
        $refusal->outcome = ['outcome' => 'already_issued', 'reference' => $reference];

        return $refusal;
    }

    public static function revoked(string $reference): self
    {
        $refusal = new self(
            "Terminal sign-in {$reference} was revoked. Run the journal command again to approve a new one.",
        );

        $refusal->status = 410;
        $refusal->refusalCode = RefusalCode::Forbidden;
        $refusal->outcome = ['outcome' => 'revoked', 'reference' => $reference];

        return $refusal;
    }

    public function refusalCode(): RefusalCode
    {
        return $this->refusalCode;
    }

    /**
     * @return array<string, string|int>
     */
    protected function details(): array
    {
        return $this->outcome;
    }

    protected function status(): int
    {
        return $this->status;
    }
}
