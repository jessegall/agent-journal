<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;

/**
 * Names one exact rule revision of one owner, as a project replacement must.
 */
final readonly class RuleReference implements StoredValue
{
    public function __construct(public RuleScope $scope, public string $id, public int $revision) {}

    /**
     * @return array{scope: array{type: string, owner: string, version: string}, id: string, revision: int}
     */
    public function toArray(): array
    {
        return ['scope' => $this->scope->toArray(), 'id' => $this->id, 'revision' => $this->revision];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self(RuleScope::fromArray($fields['scope']), $fields['id'], $fields['revision']);
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
