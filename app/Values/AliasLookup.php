<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The answer to looking an alias up: found, with its body, revision, digest and declared positional arguments, or
 * missing. A missing alias is never a fabricated empty one.
 */
final readonly class AliasLookup
{
    /**
     * @param  list<string>  $arguments  the names of the positional arguments the body takes
     */
    private function __construct(
        public bool $isFound,
        public string $name,
        public string $id,
        public string $body,
        public int $revision,
        public string $digest,
        public array $arguments,
    ) {}

    /**
     * @param  list<string>  $arguments
     */
    public static function found(
        string $id,
        string $name,
        string $body,
        int $revision,
        string $digest,
        array $arguments,
    ): self {
        return new self(true, $name, $id, $body, $revision, $digest, $arguments);
    }

    public static function missing(string $name): self
    {
        return new self(false, $name, '', '', 0, '', []);
    }

    public function reference(): string
    {
        return "alias:{$this->name}#{$this->id}@{$this->revision}";
    }
}
