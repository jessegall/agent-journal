<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Turns its child's match into no match and the other way round; an unavailable child stays unavailable.
 */
final readonly class Not implements SkillCondition
{
    public const string TYPE = 'not';

    public const int VERSION = 1;

    public function __construct(
        public SkillCondition $child,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        $evaluation = $this->child->evaluate($context);

        return match ($evaluation->outcome) {
            ConditionOutcome::Match => ConditionResult::noMatch('not:'.$evaluation->reason),
            ConditionOutcome::NoMatch => ConditionResult::match('not:'.$evaluation->reason),
            ConditionOutcome::Unavailable => $evaluation,
        };
    }

    public function toArray(): array
    {
        return [
            'type' => self::TYPE,
            'version' => self::VERSION,
            'children' => [$this->child->toArray()],
        ];
    }
}
