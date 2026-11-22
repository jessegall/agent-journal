<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ManifestMount;
use App\Values\WorkspacePreparation;

/**
 * Where a contained environment's workspace comes from, and the mount that puts it at /workspace.
 */
interface WorkspaceSource
{
    public function mount(bool $writable): ManifestMount;

    /**
     * What the host makes ready before a container mounts it.
     */
    public function preparation(): WorkspacePreparation;
}
