<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One named value a host sets for a start: an environment variable or an entry of the account's own configuration.
 */
final readonly class StartSetting
{
    public function __construct(
        public string $name,
        public string $value,
    ) {}
}
