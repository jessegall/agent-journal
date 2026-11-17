<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Rules\Models\Rule;

/**
 * The named reads of rules for a page: every rule, newest first. Every agent and the owner read every rule.
 */
final readonly class RuleRecords
{
    /**
     * @return list<Rule>
     */
    public function all(): array
    {
        return array_values(Rule::query()->orderByDesc('id')->get()->all());
    }
}
