<?php

declare(strict_types=1);

namespace Domain\Memory\Policies;

use App\Access\Contracts\Policy;
use Domain\Memory\Models\Memory;

/**
 * Who may work with memories: every granted actor, so the grants decide.
 */
final readonly class MemoryPolicy implements Policy
{
    public static function model(): string
    {
        return Memory::class;
    }
}
