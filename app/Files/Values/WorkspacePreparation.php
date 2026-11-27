<?php

declare(strict_types=1);

namespace App\Files\Values;

use App\Hosts\Protocol\Data\HostWorkspaceCloneData;
use App\Hosts\Protocol\Data\HostWorkspacePreparationData;

/**
 * What the host makes ready before a contained session's container mounts the workspace: a Git workspace's volume to
 * fill the first time, or an operator's folder to check at every start. Exactly one of the two is set.
 */
final readonly class WorkspacePreparation
{
    private function __construct(
        public WorkspaceClone|null $clone,
        public string|null $folder,
    ) {}

    public function protocolData(): HostWorkspacePreparationData
    {
        return HostWorkspacePreparationData::from([
            'clone' => $this->clone === null ? null : HostWorkspaceCloneData::from(get_object_vars($this->clone)),
            'folder' => $this->folder,
        ]);
    }

    public static function ofClone(WorkspaceClone $clone): self
    {
        return new self($clone, null);
    }

    public static function ofFolder(string $folder): self
    {
        return new self(null, $folder);
    }
}
