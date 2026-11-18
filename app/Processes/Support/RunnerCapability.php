<?php

declare(strict_types=1);

namespace App\Processes\Support;

use Illuminate\Contracts\Config\Repository;

/**
 * Whether this host runs admitted command lines under the supervisor: off unless processes.runner is switched on.
 */
final readonly class RunnerCapability
{
    public function __construct(private Repository $config) {}

    public function isOn(): bool
    {
        return $this->config->get('processes.runner') === true;
    }
}
