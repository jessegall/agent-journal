<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Which package script a command ran and the exact body it resolved to: a changed body has a new digest, so anything
 * bound to the old one no longer matches.
 */
#[MapName(SnakeCaseMapper::class)]
final class ScriptBinding extends Data
{
    public function __construct(public readonly string $packageFile, public readonly string $script, public readonly string $digest) {}

    public function reference(): string
    {
        return "script:{$this->packageFile}#{$this->script}@".substr($this->digest, 0, 12);
    }
}
