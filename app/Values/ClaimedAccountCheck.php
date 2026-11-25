<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Accounts\SignInMethod;

/**
 * An account check a host took: the account, its driver and method, its folder on the host and the generation to report in.
 */
final readonly class ClaimedAccountCheck
{
    public function __construct(
        public string $accountId,
        public string $driver,
        public SignInMethod $method,
        public string $directory,
        public int $generation,
    ) {}
}
