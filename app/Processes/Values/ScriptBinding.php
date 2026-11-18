<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;

/**
 * Which package script a command ran and the exact body it resolved to: a changed body has a new digest, so anything
 * bound to the old one no longer matches.
 */
final readonly class ScriptBinding implements StoredValue
{
    public function __construct(public string $packageFile, public string $script, public string $digest) {}

    /**
     * @return array{package_file: string, script: string, digest: string}
     */
    public function toArray(): array
    {
        return ['package_file' => $this->packageFile, 'script' => $this->script, 'digest' => $this->digest];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self($fields['package_file'], $fields['script'], $fields['digest']);
    }

    public function reference(): string
    {
        return "script:{$this->packageFile}#{$this->script}@".substr($this->digest, 0, 12);
    }
}
