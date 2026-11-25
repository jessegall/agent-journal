<?php

declare(strict_types=1);

namespace App\Events\Processes;

/**
 * A command alias recorded the line it runs.
 */
final readonly class CommandAliasLineRecorded extends ProcessEvent
{
    public function __construct(public string $aliasId) {}
}
