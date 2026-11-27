<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Values\SignInChallenge;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A sign-in the test began: its status and refusal, the challenge it showed the owner and the account it signed in.
 */
final readonly class SignInFacts implements Facts
{
    public function __construct(private string $attemptId, private SignInChallenge|null $challenge) {}

    public function facts(): array
    {
        $attempt = SignInAttempt::query()->whereKey($this->attemptId)->sole();
        $accountId = $attempt->result_account_id ?? $attempt->account_id;

        return [
            'status' => $attempt->status,
            'refusal' => $attempt->refusal,
            'challenge' => $this->challenge === null ? null : [
                'host' => parse_url($this->challenge->address, PHP_URL_HOST),
                'address' => $this->challenge->address,
                'code' => $this->challenge->code,
            ],
            'account' => fn () => $accountId === null
                ? null
                : new AccountFacts(Account::query()->whereKey($accountId)->sole()),
        ];
    }
}
