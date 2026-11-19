<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Actors\Values\AbilityRequirement;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches an actor whose own profile grants every listed ability, asked for that actor, never for the caller.
 */
final readonly class Abilities implements SkillCondition
{
    public const string TYPE = 'abilities';

    public const int VERSION = 1;

    /**
     * @param  list<AbilityRequirement>  $requirements
     */
    public function __construct(
        public array $requirements,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        foreach ($this->requirements as $requirement) {
            if (! $context->grants($requirement)) {
                return ConditionResult::noMatch('ability-not-granted');
            }
        }

        return ConditionResult::match('abilities-granted');
    }

    public function toArray(): array
    {
        return [
            'type' => self::TYPE,
            'version' => self::VERSION,
            'keys' => array_map(fn (AbilityRequirement $requirement) => $requirement->key(), $this->requirements),
        ];
    }
}
