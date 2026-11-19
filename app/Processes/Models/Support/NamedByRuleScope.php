<?php

declare(strict_types=1);

namespace App\Processes\Models\Support;

use App\Processes\Values\RuleScope;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A row named by a rule's scope and id, found with ofRule().
 */
trait NamedByRuleScope
{
    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function ofRule(Builder $query, RuleScope $scope, string $ruleId): void
    {
        $query->where('scope_type', $scope->type->value)
            ->where('scope_owner', $scope->owner)
            ->where('rule_id', $ruleId);
    }
}
