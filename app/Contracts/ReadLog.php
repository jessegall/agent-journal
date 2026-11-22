<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\ReadCounts;

/**
 * What other Core areas use of the Reads area's ReadLog.
 */
interface ReadLog
{
    public function record(string $label, ReadCounts $counts): void;
}
