<?php

declare(strict_types=1);

namespace App\Reads\Contracts;

use App\Reads\Values\ReadCounts;

/**
 * What other Core areas use of the Reads area's ReadLog.
 */
interface ReadLog
{
    public function record(string $label, ReadCounts $counts): void;
}
