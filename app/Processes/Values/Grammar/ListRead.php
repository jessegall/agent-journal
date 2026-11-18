<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

/**
 * A list read into its parent node.
 */
final readonly class ListRead
{
    public function __construct(public int $parent) {}
}
