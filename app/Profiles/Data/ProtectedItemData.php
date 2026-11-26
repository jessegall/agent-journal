<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Attributes\Validation\Present;
use Spatie\LaravelData\Data;

/**
 * One item of a host's protection report: whether the pinned client keeps its tools from it there, the native run
 * that showed it, or why it is not kept. The host sends both texts, the one that does not apply empty.
 */
final class ProtectedItemData extends Data
{
    public function __construct(
        public readonly string $item,
        public readonly bool $isEnforced,
        #[Present]
        public readonly string $evidence,
        #[Present]
        public readonly string $reason,
    ) {}
}
