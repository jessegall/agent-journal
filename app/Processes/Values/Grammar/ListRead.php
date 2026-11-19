<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

/**
 * A list read into its parent node, with the context it was read in.
 */
final readonly class ListRead
{
    public function __construct(public GrammarContext $context, public int $parent) {}
}
