<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

/**
 * The folder of a driver's image recipe under the project, whose VERSION file pins the driver it installs: what each
 * host builds once and every contained start of the driver runs.
 */
final readonly class DriverImage
{
    private function __construct(public string $folder, public bool $runsCommandsInLoginShell) {}

    public static function at(string $folder): self
    {
        return new self($folder, false);
    }

    /**
     * The driver runs the model's commands in its user's login shell, so its built image is checked through that
     * shell too.
     */
    public function runningCommandsInLoginShell(): self
    {
        return new self($this->folder, true);
    }

    /**
     * The driver family whose image this folder builds, the folder's own name under .docker/drivers.
     */
    public function family(): string
    {
        return basename($this->folder);
    }
}
