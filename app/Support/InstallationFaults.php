<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Values\FilePath;

/**
 * What the installation could not heal by itself, one plain sentence each: the updater's supervisor writes them to
 * storage/installation/faults (.docker/updater/heal.sh) and empties the file once every service is well again.
 */
final readonly class InstallationFaults
{
    public function __construct(private Files $files, private FilePath $faults) {}

    /**
     * @return list<string>
     */
    public function current(): array
    {
        if (! $this->files->exists($this->faults)) {
            return [];
        }

        return array_values(array_filter(explode("\n", $this->files->read($this->faults))));
    }
}
