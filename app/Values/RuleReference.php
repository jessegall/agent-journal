<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Names one exact rule revision of one owner, as a project replacement must.
 */
#[MapName(SnakeCaseMapper::class)]
final class RuleReference extends Data
{
    public function __construct(
        public readonly RuleScope $scope,
        public readonly string $id,
        public readonly int $revision,
    ) {}

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
