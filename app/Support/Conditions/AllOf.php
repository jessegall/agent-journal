<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\Skills\SkillCondition;
use App\Enums\Skills\ConditionOutcome;
use App\Values\ConditionResult;
use App\Values\SkillContext;

/**
 * Matches when every child matches. Any child that does not match decides first; otherwise an unavailable child makes
 * the whole unavailable.
 */
final readonly class AllOf implements SkillCondition
{
    public const string TYPE = 'all';

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

        return ConditionResult::firstWith(ConditionOutcome::NoMatch, $evaluations)
            ?? ConditionResult::firstWith(ConditionOutcome::Unavailable, $evaluations)
            ?? ConditionResult::match('all-matched');
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
