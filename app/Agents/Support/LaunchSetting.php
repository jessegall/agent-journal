<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One named value a host sets for a launch: an environment variable or an entry of the account's own configuration.
 */
final readonly class LaunchSetting
{
    public function __construct(
        public string $name,
        public string $value,
    ) {}
}
