<?php

declare(strict_types=1);

namespace App\Sessions\Values;

use App\Agents\ContainerManifest;

/**
 * The container a contained session's processes run in, with what is made ready before it.
 */
final readonly class SessionContainer
{
    public function __construct(
        public ContainerManifest $manifest,
    ) {}
}
