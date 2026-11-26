<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Hosts\ServedEnvironment as ServedEnvironmentContract;
use App\Exceptions\FolderOutsideProject;

/**
 * The connected folder a request serves, once the request came through one: its environment and the folder its work
 * may run in. It lives for one request (Octane), never longer, and is never taken from what a client sends.
 */
final class ServedEnvironment implements ServedEnvironmentContract
{
    private ConnectedProject|null $connectedProject = null;

    /**
     * Makes this request one of a connected folder: its environment, and the folder its work may run in.
     */
    public function connect(ConnectedProject $project): void
    {
        $this->connectedProject = $project;
    }

    /**
     * The environment of the binding the request came through: none for this installation's own project.
     *
     * @return list<string>
     */
    public function environmentIds(): array
    {
        $environmentId = $this->environmentId();

        if ($environmentId === null) {
            return [];
        }

        return [$environmentId];
    }

    public function environmentId(): string|null
    {
        return $this->connectedProject?->environmentId;
    }

    /**
     * Refuses a folder outside the connected project's folder; a request of this installation's own project names
     * any folder its own checks allow.
     *
     * @throws FolderOutsideProject
     */
    public function assertFolderAllowed(string $folder): void
    {
        if ($this->connectedProject === null || $this->connectedProject->contains($folder)) {
            return;
        }

        throw FolderOutsideProject::for($folder);
    }
}
