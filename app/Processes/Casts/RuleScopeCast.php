<?php

declare(strict_types=1);

namespace App\Processes\Casts;

use App\Processes\Values\RuleScope;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * A rule's owner in the three columns scope_type, scope_owner and scope_version, so rows are found by their owner.
 *
 * @implements CastsAttributes<RuleScope, RuleScope>
 */
final class RuleScopeCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): RuleScope
    {
        return RuleScope::fromArray([
            'type' => $attributes['scope_type'],
            'owner' => $attributes['scope_owner'],
            'version' => $attributes['scope_version'],
        ]);
    }

    /**
     * @param  RuleScope  $value
     * @param  array<string, mixed>  $attributes
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        return [
            'scope_type' => $value->type->value,
            'scope_owner' => $value->owner,
            'scope_version' => $value->version,
        ];
    }
}
