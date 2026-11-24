<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScopeType;

/**
 * The owner of a command rule: Core, one module at one version and content digest, or the project.
 */
final readonly class RuleScope
{
    private function __construct(
        public ScopeType $type,
        public string $owner,
        public string $version,
    ) {}

    public static function core(): self
    {
        return new self(ScopeType::Core, 'core', '');
    }

    public static function module(string $module, string $version): self
    {
        return new self(ScopeType::Module, $module, $version);
    }

    public static function project(): self
    {
        return new self(ScopeType::Project, 'project', '');
    }

    /**
     * The scope as it was stored, read back without the checks of a new one.
     */
    public static function stored(ScopeType $type, string $owner, string $version): self
    {
        return new self($type, $owner, $version);
    }

    public function name(): string
    {
        if ($this->version === '') {
            return $this->owner;
        }

        return "{$this->owner}@{$this->version}";
    }

    public function isSameOwner(self $other): bool
    {
        return $this->type === $other->type && $this->owner === $other->owner;
    }
}
