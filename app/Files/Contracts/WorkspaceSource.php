<?php

declare(strict_types=1);

namespace App\Files\Contracts;

use App\Files\ManifestMount;
use App\Hosts\HelperRuns;
use App\Hosts\Protocol\Payloads\HostContainerRunPayload;

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
     * The helper runs that make it ready before a container mounts it.
     *
     * @return list<HostContainerRunPayload>
     */
    public function preparations(HelperRuns $runs): array;
}
