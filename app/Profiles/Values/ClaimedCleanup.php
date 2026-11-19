<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\CleanupTarget;

/**
 * A cleanup a host took: what it cleans, by id, its program, its folder on the host, the generation to report in and
 * whether the program's sign-in store was already proven gone.
 */
final readonly class ClaimedCleanup
{
    public function __construct(
        public CleanupTarget $target,
        public string $id,
        public string $program,
        public string $directory,
        public int $generation,
        public bool $isStoreRemoved,
    ) {}
}
