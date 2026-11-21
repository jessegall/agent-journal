<?php

declare(strict_types=1);

namespace App\Agents\Support;

use Spatie\LaravelData\Data;

/**
 * A workspace the operator keeps as a server folder under /srv/journal/workspaces, bound in place after the host's
 * daemon-side check.
 */
final class FolderWorkspace extends Data implements WorkspaceSource
{
    public const string ROOT = '/srv/journal/workspaces';

    public function __construct(public readonly string $folder) {}

    public function mount(bool $writable): ManifestMount
    {
        return ManifestMount::daemonBind(self::ROOT.'/'.$this->folder, ContainerManifest::WORKDIR, $writable);
    }
}
