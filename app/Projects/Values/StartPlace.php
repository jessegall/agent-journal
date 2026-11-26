<?php

declare(strict_types=1);

namespace App\Projects\Values;

/**
 * Where a start runs: the host that runs it and the folder it starts in.
 */
final readonly class StartPlace
{
    public function __construct(
        public string $hostId,
        public string $folder,
    ) {}
}
