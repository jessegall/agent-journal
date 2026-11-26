<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Data\EligibleAccountData;
use App\Models\Accounts\Account;

/**
 * How an account becomes a choice of a start form; kept out of the exported Data class.
 */
final readonly class EligibleAccountFactory
{
    public static function of(Account $account, bool $isDefault): EligibleAccountData
    {
        return new EligibleAccountData(
            $account->id,
            $account->label,
            $account->start_unavailable_reason,
            $account->start_unavailable_reason?->sentence(),
            $account->expires_at?->toIso8601String(),
            $account->sign_in_generation,
            $isDefault,
        );
    }
}
