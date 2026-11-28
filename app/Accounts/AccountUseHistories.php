<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Support\RecordIdentity;
use App\Values\AccountUse;

final readonly class AccountUseHistories
{
    /** @var array<string, list<AccountUse>> */
    private array $byAccount;

    /** @param list<AccountUse> $uses */
    public function __construct(array $uses)
    {
        $byAccount = [];

        foreach ($uses as $use) {
            $byAccount[$use->account->reference()][] = $use;
        }

        $this->byAccount = $byAccount;
    }

    /** @return list<AccountUse> */
    public function forAccount(RecordIdentity $account): array
    {
        return $this->byAccount[$account->reference()] ?? [];
    }
}
