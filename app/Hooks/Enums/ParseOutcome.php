<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * How far the parser read a shell line: fully, up to a dynamic expansion it cannot resolve, or not at all.
 */
enum ParseOutcome: string
{
    case Complete = 'complete';
    case DynamicExpansion = 'dynamic_expansion';
    case Unparsed = 'unparsed';

    public function isComplete(): bool
    {
        return $this === self::Complete;
    }
}
