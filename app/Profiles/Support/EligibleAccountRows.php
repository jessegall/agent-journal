<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Http\Data\Profiles\EligibleAccountData;
use App\Profiles\Models\Account;

/**
 * How an account becomes a choice of a start form; kept out of the exported Data class.
 */
final readonly class EligibleAccountRows
{
    public static function of(Account $account, bool $isDefault): EligibleAccountData
    {
        return new EligibleAccountData(
            $account->id,
            $account->label,
            $account->startUnavailableReason(),
            $account->startUnavailableReason()?->sentence(),
            $account->expires_at?->toIso8601String(),
            $account->sign_in_generation,
            $isDefault,
        );
    }
}
