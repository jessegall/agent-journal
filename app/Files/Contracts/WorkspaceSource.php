<?php

declare(strict_types=1);

namespace App\Files\Contracts;

use App\Files\ManifestMount;
use App\Files\Values\WorkspacePreparation;

/**
 * Where a contained environment's workspace comes from, and the mount that puts it at /workspace.
 */
interface WorkspaceSource
{
    /**
     * How the workspace is mounted into an agent's container, writable or read only.
     */
    public function mount(bool $isWritable): ManifestMount;

    /**
     * What the host makes ready before a container mounts it.
     */
    public function preparation(): WorkspacePreparation;
}
