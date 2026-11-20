<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Enums\SignInMethod;

/**
 * A cleanup a host took: what it cleans, by id, its program and method, its folder on the host, the generation to report in and
 * whether the program's sign-in store was already proven gone.
 */
final readonly class ClaimedCleanup
{
    public function __construct(
        public CleanupTarget $target,
        public string $id,
        public string $program,
        public SignInMethod $method,
        public string $directory,
        public int $generation,
        public bool $isStoreRemoved,
        // The account whose folder this is, none for a new account's attempt.
        public string|null $accountId,
    ) {}
}
