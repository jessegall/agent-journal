<?php

declare(strict_types=1);

namespace App\Domain\Contracts;

/**
 * Counts what a navigation item shows beside its label; built per request by the container.
 */
interface CountReader
{
    public function count(): int;
}
