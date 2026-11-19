<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartUnavailableReason;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * No account can start a start of the program; it names only the program and a safe reason.
 */
final class AccountUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public function __construct(
        string $message,
        public readonly string $program,
        public readonly StartUnavailableReason $reason,
    ) {
        parent::__construct($message);
    }

    public static function forStart(string $program, StartUnavailableReason $reason): self
    {
        return new self("{$program} cannot be started now: {$reason->sentence()}.", $program, $reason);
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
     * @return array{program: string, reason: string}
     */
    protected function details(): array
    {
        return ['program' => $this->program, 'reason' => $this->reason->value];
    }
}
