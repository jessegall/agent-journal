<?php

declare(strict_types=1);

namespace App\Processes\Support;

use Illuminate\Contracts\Config\Repository;

/**
 * The key of the project this installation serves (plan 14, decision D3), read for each request from configuration,
 * never kept between requests.
 */
final readonly class ProjectKey
{
    public function __construct(private Repository $config) {}

    public function current(): string
    {
        return (string) $this->config->get('processes.project_key');
    }
}
