<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartUnavailableReason;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

/**
 * No account can start a start of the program; it names only the program and a safe reason.
 */
final class AccountUnavailable extends RuntimeException implements CodedRefusal, StartRefusal
{
    use RendersRefusal;

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
        return ['driver' => $this->driver, 'reason' => $this->reason->value];
    }
}
