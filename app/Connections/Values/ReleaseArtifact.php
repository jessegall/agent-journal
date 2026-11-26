<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One file asked of a published release: its version, the target folder (darwin-arm64) and the name it is installed
 * under (bin/journal-agent).
 */
final readonly class ReleaseArtifact
{
    public function __construct(public string $version, public string $target, public string $name) {}
}
