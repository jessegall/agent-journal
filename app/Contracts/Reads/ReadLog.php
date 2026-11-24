<?php

declare(strict_types=1);

namespace App\Contracts\Reads;

use App\Values\ReadCounts;

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
