<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\ContainerManifest;
use App\Files\Contracts\WorkspaceSource;
use App\Files\ManifestMount;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * A workspace cloned from Git into the environment's own volume (<installation>-workspace-<environment>) by a
 * helper run, with the deploy key of the named host secret.
 */
final class GitWorkspace extends Data implements WorkspaceSource
{
    public function __construct(
        public readonly string $volume,
        #[MapInputName('git')]
        public readonly string $repository,
        public readonly string $revision,
        #[MapInputName('deploy_key_secret')]
        public readonly string $deployKeySecret,
    ) {}

    public function mount(bool $isWritable): ManifestMount
    {
        return ManifestMount::volume($this->volume, ContainerManifest::WORKDIR, $isWritable);
    }

    public function preparations(HelperRuns $runs): array
    {
        return [$runs->workspaceClone($this->volume, $this->repository, $this->revision, $this->deployKeySecret)];
    }
}
