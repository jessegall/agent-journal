<?php

declare(strict_types=1);

namespace App\Core\Hooks\Relay;

use App\Core\Agents\BypassReport;
use App\Core\Agents\LoggedBypass;

/**
 * The host's own file of bypasses not yet uploaded, one JSON line each.
 */
final readonly class BypassLog
{
    public function __construct(private string $path) {}

    public function append(LoggedBypass $fact): void
    {
        file_put_contents($this->path, $fact->toJson().PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    public function pending(): BypassReport
    {
        $lines = is_file($this->path) ? array_filter(explode(PHP_EOL, (string) file_get_contents($this->path))) : [];

        return BypassReport::from(['bypasses' => array_values(array_map(fn (string $line) => json_decode($line, true, flags: JSON_THROW_ON_ERROR), $lines))]);
    }

    public function clear(): void
    {
        if (is_file($this->path)) {
            unlink($this->path);
        }
    }
}
