<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The account the owner chose for one start and the sign-in revision they reviewed, in place of the saved default.
 */
final readonly class ChosenAccount
{
    public function __construct(
        public string $accountId,
        public int $reviewedSignIn,
    ) {}
}
