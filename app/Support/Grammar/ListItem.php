<?php

declare(strict_types=1);

namespace App\Support\Grammar;

/**
 * One and-or chain read for a list, not yet placed in it.
 */
final readonly class ListItem
{
    public function __construct(public UnparsedList $toParse, public int $node) {}
}
