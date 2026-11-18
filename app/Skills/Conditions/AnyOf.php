<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches when any child matches; otherwise an unavailable child makes the whole unavailable, and else nothing matched.
 */
final readonly class AnyOf implements SkillCondition
{
    public const string TYPE = 'any';

    public const int VERSION = 1;

    /**
     * @param  list<SkillCondition>  $children
     */
    public function __construct(
        public array $children,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        $results = array_map(fn (SkillCondition $child) => $child->evaluate($context), $this->children);

        return ConditionResult::firstWith(ConditionOutcome::Match, $results)
            ?? ConditionResult::firstWith(ConditionOutcome::Unavailable, $results)
            ?? ConditionResult::noMatch('none-matched');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => self::VERSION, 'children' => array_map(fn (SkillCondition $child) => $child->toArray(), $this->children)];
    }
}
