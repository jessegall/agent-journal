<?php

declare(strict_types=1);

namespace App\Reads\Contracts;

use App\Reads\Values\ReadCounts;

/**
 * What other Core areas use of the Reads area's ReadLog.
 */
interface ReadLog
{
    /**
     * Logs how many rows the read of the label took.
     */
    public function record(string $label, ReadCounts $counts): void;
}
