<?php

declare(strict_types=1);

namespace App\Contracts\Records;

/**
 * Counts what a navigation item shows beside its label; built per request by the container.
 */
interface CountResolver
{
    public function count(): int;
}
