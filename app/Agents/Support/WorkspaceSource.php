<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * Where a contained environment's workspace comes from, and the mount that puts it at /workspace.
 */
interface WorkspaceSource
{
    public function mount(bool $writable): ManifestMount;
}
