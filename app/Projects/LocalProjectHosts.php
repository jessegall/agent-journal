<?php

declare(strict_types=1);

namespace App\Projects;

use App\Hosts\Contracts\LocalProjectHosts as LocalProjectHostsContract;
use App\Models\Projects\ProjectBinding;

/**
 * Answers Agents which live binding a local host serves, from the project bindings.
 */
final readonly class LocalProjectHosts implements LocalProjectHostsContract
{
    public function liveBindingOf(string $hostId): array
    {
        return ProjectBinding::resolveLiveIdOfLocalHost($hostId);
    }
}
