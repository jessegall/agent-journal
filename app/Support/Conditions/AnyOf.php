<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\Skills\SkillCondition;
use App\Enums\Skills\ConditionOutcome;
use App\Values\ConditionResult;
use App\Values\SkillContext;

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
        $evaluations = array_map(fn (SkillCondition $child) => $child->evaluate($context), $this->children);

        return ConditionResult::firstWith(ConditionOutcome::Match, $evaluations)
            ?? ConditionResult::firstWith(ConditionOutcome::Unavailable, $evaluations)
            ?? ConditionResult::noMatch('none-matched');
    }

    public function toArray(): array
    {
        return [
            'type' => self::TYPE,
            'version' => self::VERSION,
            'children' => array_map(fn (SkillCondition $child) => $child->toArray(), $this->children),
        ];
    }
}
