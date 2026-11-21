<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;

/**
 * One item of a host's protection report: whether the pinned client keeps its tools from it there, the native run
 * that showed it, or why it is not kept.
 */
final class ProtectedItemData extends Data
{
    public function __construct(
        public readonly string $item,
        public readonly bool $enforced,
        public readonly string $evidence = '',
        public readonly string $reason = '',
    ) {}
}
