<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Rules\Models\Rule;

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
        $rules = Rule::query()->active()->orderBy('id')->get(['id', 'text']);

        return array_values($rules->map(fn (Rule $rule) => "Rule {$rule->id}: {$rule->text}")->all());
    }
}
