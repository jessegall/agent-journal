<?php

declare(strict_types=1);

namespace App\Accounts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Support\RecordIdentity;
use RuntimeException;

/**
 * An account's maintenance cannot settle while starts still run on it.
 */
final class AccountInUse extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forAccount(RecordIdentity $account, int $running): self
    {
        return new self("Account {$account->type} {$account->id} still has {$running} running starts.");
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
