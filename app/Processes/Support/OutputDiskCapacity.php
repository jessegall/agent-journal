<?php

declare(strict_types=1);

namespace App\Processes\Support;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Filesystem\Factory;

/**
 * Whether the output disk has room for a new run's full capture; while it does not, admission starts nothing, and the
 * refusal lifts by itself once room returns.
 */
final readonly class OutputDiskCapacity
{
    public function __construct(private Factory $disks, private Repository $config) {}

    public function hasRoom(): bool
    {
        $root = $this->disks->disk(SpoolRecorder::DISK)->path('');
        $free = is_dir($root) ? disk_free_space($root) : false;

        return $free === false || $free >= (int) $this->config->get('processes.minimum_free_bytes');
    }
}
