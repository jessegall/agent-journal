<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One file of a published release: where it lies inside the release folder and the SHA-256 its manifest records.
 */
final readonly class ReleaseFile
{
    public function __construct(public string $source, public string $sha256) {}
}
