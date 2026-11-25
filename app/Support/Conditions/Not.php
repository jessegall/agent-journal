<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\Skills\SkillCondition;
use App\Enums\ConditionOutcome;
use App\Values\ConditionResult;
use App\Values\SkillContext;

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
