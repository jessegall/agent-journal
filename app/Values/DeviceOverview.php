<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What journal overview answers a terminal sign-in: the project and environment its binding works in, and the tasks
 * of that environment assigned to the user who approved the terminal.
 */
final readonly class DeviceOverview
{
    public function __construct(
        public string $projectLabel,
        public string $environmentLabel,
        public EnvironmentTaskList $tasks,
    ) {}
}
