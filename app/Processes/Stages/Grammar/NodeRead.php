<?php

declare(strict_types=1);

namespace App\Processes\Stages\Grammar;

/**
 * The node a grammar rule read.
 */
final readonly class NodeRead
{
    public function __construct(public int $node) {}
}
