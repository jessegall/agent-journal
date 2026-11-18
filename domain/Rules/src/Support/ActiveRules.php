<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use Domain\Rules\Models\Rule;

/**
 * The named read of the rules that hold now.
 */
final readonly class ActiveRules
{
    /**
     * @return list<string>
     */
    public function reminders(): array
    {
        $rules = Rule::query()->active()->orderBy('id')->readAll('every active rule is a reminder')->get(['id', 'text']);

        return array_values($rules->map(fn (Rule $rule) => "Rule {$rule->id}: {$rule->text}")->all());
    }
}
