<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Which package script a command ran and the exact body it resolved to: a changed body has a new digest, so anything
 * bound to the old one no longer matches.
 */
#[MapName(SnakeCaseMapper::class)]
final class ScriptBinding extends Data implements StoredValue
{
    public function __construct(
        public readonly string $packageFile,
        public readonly string $script,
        public readonly string $digest,
    ) {}

    public function reference(): string
    {
        return "script:{$this->packageFile}#{$this->script}@".substr($this->digest, 0, 12);
    }

    public static function fromJson(string $json): self
    {
        return ScriptBinding::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR));
    }

    public static function listFromJson(string $json): array
    {
        return array_values(ScriptBinding::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)));
    }
}
