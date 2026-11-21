<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use App\Processes\Stored\StoredScriptBinding;

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

    public static function fromJson(string $json): self
    {
        return StoredScriptBinding::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR))->binding();
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            fn (StoredScriptBinding $stored) => $stored->binding(),
            StoredScriptBinding::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }

    public function reference(): string
    {
        return "script:{$this->packageFile}#{$this->script}@".substr($this->digest, 0, 12);
    }
}
