<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Exceptions\PlaceUnavailable;
use Illuminate\Contracts\Config\Repository;

/**
 * Whether the output disk has room for a new run's full capture; while it does not, admission starts nothing, and the
 * refusal lifts by itself once room returns.
 */
final readonly class OutputDiskCapacity
{
    public function __construct(private Files $files, private Repository $config) {}

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

        return $free >= (int) $this->config->get('processes.minimum_free_bytes');
    }
}
