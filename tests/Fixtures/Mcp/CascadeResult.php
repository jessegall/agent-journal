<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp;

/**
 * The result of a large cascade write, with one outcome per record it changed.
 */
final readonly class CascadeResult
{
    /**
     * @param  list<array{record: string, changed: bool}>  $outcomes
     */
    public function __construct(public string $root, public array $outcomes) {}
}
