<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

/**
 * The reader of one headless turn of a driver's process.
 */
interface TurnResults
{
    /**
     * The reader of what the turn of the process prints.
     */
    public function __invoke(string $processId): TurnResult;
}
