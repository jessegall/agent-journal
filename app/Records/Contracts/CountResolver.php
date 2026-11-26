<?php

declare(strict_types=1);

namespace App\Records\Contracts;

/**
 * Counts what a navigation item shows beside its label; built per request by the container.
 */
interface CountResolver
{
    /**
     * How many records the resolver's reader may see.
     */
    public function count(): int;
}
