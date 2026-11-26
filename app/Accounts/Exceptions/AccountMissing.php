<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * No saved account the actor may change has this id, or it is removed and keeps its name for history only.
 */
final class AccountMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<AccountMissing>
     */
    use ThrowsLater;

    public static function for(string $accountId): self
    {
        return new self("No saved account {$accountId} can be changed.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
