<?php

declare(strict_types=1);

namespace App\Processes;

use App\Exceptions\PlaceUnavailable;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use Illuminate\Container\Attributes\Config;

/**
 * Whether the output disk has room for a new run's full capture; while it does not, admission starts nothing, and the
 * refusal lifts by itself once room returns.
 */
final readonly class OutputDiskCapacity
{
    public function __construct(
        private Files $files,
        #[Config('processes.minimum_free_bytes')]
        private int $minimumFreeBytes,
    ) {}

    /**
     * Whether the disk of the process-output place has the room the settings ask for; a disk whose room cannot be
     * read does not stop a run.
     */
    public function hasRoom(): bool
    {
        try {
            $free = $this->files->freeSpace(Place::ProcessOutput);
        } catch (PlaceUnavailable) {
            return true;
        }

        return $free >= $this->minimumFreeBytes;
    }
}
