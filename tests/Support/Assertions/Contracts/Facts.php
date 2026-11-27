<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Contracts;

/**
 * The facts of one subject of a test, as an assertion scope reads them by key.
 */
interface Facts
{
    /**
     * Each fact by its key: a plain value, a list or map of values, another subject's facts, or a closure that reads
     * the fact only when a test asks for it.
     *
     * @return array<string|int, mixed>
     */
    public function facts(): array;
}
