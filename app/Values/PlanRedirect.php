<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\RedirectType;
use Spatie\LaravelData\Data;

/**
 * One descriptor operation of a planned command, in source order: the descriptor, what is done to it and its target
 * (a path, a descriptor number, or a here-document's text).
 */
final class PlanRedirect extends Data
{
    public function __construct(
        public readonly int $descriptor,
        public readonly RedirectType $type,
        public readonly PlanWord $target,
    ) {}
}
