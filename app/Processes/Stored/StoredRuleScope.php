<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Enums\ScopeType;
use App\Processes\Values\RuleScope;
use Spatie\LaravelData\Data;

/**
 * The owner of a rule as a stored rule or reference holds it.
 */
final class StoredRuleScope extends Data
{
    public function __construct(
        public readonly ScopeType $type,
        public readonly string $owner,
        public readonly string $version,
    ) {}

    public static function fromRuleScope(RuleScope $scope): self
    {
        return new self($scope->type, $scope->owner, $scope->version);
    }

    public function toRuleScope(): RuleScope
    {
        return RuleScope::stored($this->type, $this->owner, $this->version);
    }
}
