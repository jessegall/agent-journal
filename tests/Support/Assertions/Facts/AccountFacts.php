<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Accounts\Account;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A driver account the journal saved: its driver and its status.
 */
final readonly class AccountFacts implements Facts
{
    public function __construct(private Account $account) {}

    public function facts(): array
    {
        return [
            'driver' => $this->account->account_protocol,
            'status' => $this->account->status,
        ];
    }
}
