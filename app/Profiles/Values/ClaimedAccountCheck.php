<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * An account check a host took: the account, its program, its folder on the host and the generation to report in.
 */
final readonly class ClaimedAccountCheck
{
    public function __construct(
        public string $accountId,
        public string $program,
        public string $directory,
        public int $generation,
    ) {}
}
