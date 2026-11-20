<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\SignInMethod;

/**
 * An account check a host took: the account, its program and method, its folder on the host and the generation to report in.
 */
final readonly class ClaimedAccountCheck
{
    public function __construct(
        public string $accountId,
        public string $program,
        public SignInMethod $method,
        public string $directory,
        public int $generation,
    ) {}
}
