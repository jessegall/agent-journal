<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ServedEnvironment;
use App\Exceptions\FolderOutsideProject;
use Illuminate\Contracts\Config\Repository;

/**
 * The key of the project a request serves (plan 14, decision D3): the project of the connected folder the request
 * came from, once the request named one, else the project this installation serves, from configuration. It lives for
 * one request (Octane), never longer, and is never taken from what a client sends.
 */
final class ProjectKey implements ServedEnvironment
{
    private ConnectedProject|null $connectedProject = null;

    public function __construct(private readonly Repository $config) {}

    /**
     * Makes this request one of a connected project: its key, and the folder its work may run in.
     */
    public function connect(ConnectedProject $project): void
    {
        $this->connectedProject = $project;
    }

    public function current(): string
    {
        if ($this->connectedProject === null) {
            return (string) $this->config->get('processes.project_key');
        }

        return $this->connectedProject->key;
    }

    /**
     * The environment of the binding the request came through: none for this installation's own project.
     *
     * @return list<string>
     */
    public function environmentIds(): array
    {
        $environmentId = $this->connectedProject?->environmentId;

        return $environmentId === null ? [] : [$environmentId];
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
