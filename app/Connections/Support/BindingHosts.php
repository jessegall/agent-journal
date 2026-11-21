<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Agents\Contracts\LocalProjectHosts;
use App\Connections\Models\ProjectBinding;

/**
 * Answers Agents which live binding a local host serves, from the project bindings.
 */
final readonly class BindingHosts implements LocalProjectHosts
{
    public function liveBindingOf(string $hostId): array
    {
        return ProjectBinding::liveIdOfLocalHost($hostId);
    }
}
