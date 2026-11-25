<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Values\AgentText;
use Domain\Rules\Models\Rule;

/**
 * The named read of the rules that hold now.
 */
final readonly class ActiveRules
{
    /**
     * @return list<AgentText>
     */
    public function reminders(): array
    {
        return array_map(
            fn (Rule $rule) => AgentText::of('rules.reminder', [
                'number' => $rule->number,
                'text' => $rule->text,
            ]),
            $this->all(),
        );
    }

    /**
     * Every rule that holds now, oldest first.
     *
     * @return list<Rule>
     */
    public function all(): array
    {
        return array_values(
            Rule::query()->active()->oldestFirst()->readAll('every active rule holds for every agent')->get(
                [
                    'id',
                    'number',
                    'text',
                ],
            )->all(),
        );
    }
}
