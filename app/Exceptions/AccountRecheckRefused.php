<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A recheck asked for an account that waits for none: it is not held for a check, or its last check gave an answer.
 */
final class AccountRecheckRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notPending(string $accountId): self
    {
        return new self("Account {$accountId} waits for no recheck.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return 409;
    }
}
