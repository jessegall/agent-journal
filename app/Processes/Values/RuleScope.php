<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ScopeType;

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

    public function name(): string
    {
        return $this->version === '' ? $this->owner : "{$this->owner}@{$this->version}";
    }

    public function isSameOwner(self $other): bool
    {
        return $this->type === $other->type && $this->owner === $other->owner;
    }
}
