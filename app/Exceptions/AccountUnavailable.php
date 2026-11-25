<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\StartRefusal;
use App\Enums\Engine\RefusalCode;
use App\Enums\Sessions\StartUnavailableReason;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * No account can start a start of the driver; it names only the driver and a safe reason.
 */
final class AccountUnavailable extends RuntimeException implements CodedRefusal, StartRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<AccountUnavailable>
     */
    use ThrowsLater;

    public function __construct(
        string $message,
        public readonly string $driver,
        public readonly StartUnavailableReason $reason,
    ) {
        parent::__construct($message);
    }

    public static function forStart(string $driver, StartUnavailableReason $reason): self
    {
        return new self("{$driver} cannot be started now: {$reason->sentence()}.", $driver, $reason);
    }

    public function reason(): StartUnavailableReason
    {
        return $this->reason;
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    /**
     * @return array{driver: string, reason: string}
     */
    protected function details(): array
    {
        return [
            'driver' => $this->driver,
            'reason' => $this->reason->value,
        ];
    }
}
