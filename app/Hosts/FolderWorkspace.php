<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\ContainerManifest;
use App\Files\Contracts\WorkspaceSource;
use App\Files\ManifestMount;
use Spatie\LaravelData\Data;

/**
 * A workspace the operator keeps as a server folder under /srv/journal/workspaces, bound in place after a helper
 * run checks it.
 */
final class FolderWorkspace extends Data implements WorkspaceSource
{
    public const string ROOT = '/srv/journal/workspaces';

    public function __construct(public readonly string $folder) {}

    public function mount(bool $isWritable): ManifestMount
    {
        return ManifestMount::daemonBind(self::ROOT.'/'.$this->folder, ContainerManifest::WORKDIR, $isWritable);
    }

    public function preparations(HelperRuns $runs): array
    {
        return [$runs->workspaceFolderCheck(self::ROOT.'/'.$this->folder)];
    }
}
