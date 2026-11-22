<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A Git workspace as the host fills it: the environment's volume, the repository and revision cloned into it, and the
 * name of the compose secret holding its deploy key, never the key.
 */
final readonly class WorkspaceClone
{
    public function __construct(
        public string $volume,
        public string $repository,
        public string $revision,
        public string $deployKeySecret,
    ) {}
}
