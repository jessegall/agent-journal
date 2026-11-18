<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * Names one exact rule revision of one owner, as a project replacement must.
 */
final readonly class RuleReference
{
    public function __construct(public RuleScope $scope, public string $id, public int $revision) {}

    public function names(CommandRule $rule): bool
    {
        return $rule->scope->isSameOwner($this->scope) && $rule->id === $this->id && $rule->revision === $this->revision;
    }
}
