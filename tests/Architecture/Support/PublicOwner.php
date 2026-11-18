<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\Support\DomainEntry;
use App\Exports\Support\Exports;

/**
 * A domain or Core, with the namespace it owns and the types it exports.
 */
final readonly class PublicOwner
{
    private const string CORE = 'Core';

    public function __construct(
        public string $name,
        public string $namespace,
        public Exports $exports,
    ) {}

    public static function fromDomain(DomainEntry $entry): self
    {
        return new self($entry->name, $entry->namespace, $entry->exports);
    }

    public static function core(Exports $exports): self
    {
        return new self(self::CORE, 'App\\', $exports);
    }

    public function isCore(): bool
    {
        return $this->name === self::CORE;
    }

    public function exportsName(string $name): bool
    {
        return $this->exports->has($name);
    }

    public function ownsName(string $name): bool
    {
        return stripos(ltrim($name, '\\'), rtrim($this->namespace, '\\').'\\') === 0;
    }
}
