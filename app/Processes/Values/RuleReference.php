<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use App\Processes\Stored\StoredRuleReference;

/**
 * Names one exact rule revision of one owner, as a project replacement must.
 */
final readonly class RuleReference implements StoredValue
{
    public function __construct(public RuleScope $scope, public string $id, public int $revision) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return StoredRuleReference::fromReference($this)->toArray();
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return StoredRuleReference::from($fields)->toReference();
    }

    public function label(): string
    {
        return "{$this->scope->name()} {$this->id}@{$this->revision}";
    }

    public function names(CommandRule $rule): bool
    {
        return $rule->scope->isSameOwner($this->scope)
            && $rule->id === $this->id
            && $rule->revision === $this->revision;
    }
}
