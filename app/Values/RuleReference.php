<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\StoredValue;
use App\Support\Stored\StoredRuleReference;

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

    public static function fromJson(string $json): self
    {
        return StoredRuleReference::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR))->toReference();
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            fn (StoredRuleReference $stored) => $stored->toReference(),
            StoredRuleReference::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
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
