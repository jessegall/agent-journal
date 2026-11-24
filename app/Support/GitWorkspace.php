<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\WorkspaceSource;
use App\Values\WorkspaceClone;
use App\Values\WorkspacePreparation;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * A workspace cloned from Git into the environment's own volume (<installation>-workspace-<environment>) by the
 * host's clone container, with the deploy key of the named compose secret.
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

    public function preparation(): WorkspacePreparation
    {
        return WorkspacePreparation::ofClone(
            new WorkspaceClone($this->volume, $this->repository, $this->revision, $this->deployKeySecret),
        );
    }
}
