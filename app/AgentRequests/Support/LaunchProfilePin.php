<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

/**
 * The authorization profile a launch was pinned to: its key and the revision in force at launch.
 */
final readonly class LaunchProfilePin
{
    public function __construct(public string $key, public int $revision) {}
}
