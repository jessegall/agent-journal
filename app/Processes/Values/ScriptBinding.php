<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * Which package script a command ran and the exact body it resolved to: a changed body has a new digest, so anything
 * bound to the old one no longer matches.
 */
final readonly class ScriptBinding
{
    public function __construct(public string $packageFile, public string $script, public string $digest) {}

    public function reference(): string
    {
        return "script:{$this->packageFile}#{$this->script}@".substr($this->digest, 0, 12);
    }
}
