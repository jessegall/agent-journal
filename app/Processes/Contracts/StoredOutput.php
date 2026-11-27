<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Models\Runs\PartRun;
use App\Processes\Enums\OutputStream;

/**
 * The output a run's parts stored, read back by stream.
 */
interface StoredOutput
{
    /**
     * The last lines of a stream, how many bytes come before them and where they end.
     *
     * @return array{text: string, before: int, end: int}
     */
    public function tail(PartRun $part, OutputStream $stream, int $lines): array;
}
