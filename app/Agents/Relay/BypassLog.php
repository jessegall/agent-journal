<?php

declare(strict_types=1);

namespace App\Agents\Relay;

use App\Agents\Relay\Values\BypassReport;
use App\Agents\Relay\Values\LoggedBypass;
use App\Files\Contracts\Files;
use App\Values\FilePath;

/**
 * The host's own file of bypasses not yet uploaded, one JSON line each.
 */
final readonly class BypassLog
{
    public function __construct(private Files $files, private FilePath $log) {}

    public function append(LoggedBypass $fact): void
    {
        $this->files->append($this->log, $fact->toJson().PHP_EOL);
    }

    public function pending(): BypassReport
    {
        $lines = $this->files->exists($this->log) ? array_filter(explode(PHP_EOL, $this->files->read($this->log))) : [];

        return BypassReport::from(['bypasses' => LoggedBypass::collect(array_values($lines))]);
    }

    public function clear(): void
    {
        $this->files->delete($this->log);
    }
}
