<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\LocalProjectHosts;
use App\Models\ProjectBinding;

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
