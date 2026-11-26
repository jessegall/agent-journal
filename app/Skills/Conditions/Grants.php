<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\AccessRequirement;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches an actor whose own profile grants every listed grant, asked for that actor, never for the caller.
 */
final readonly class Grants implements SkillCondition
{
    public const string TYPE = 'abilities';

    public const int VERSION = 1;

    /**
     * @param  list<AccessRequirement>  $requirements
     */
    public function __construct(
        public array $requirements,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        foreach ($this->requirements as $requirement) {
            if (! $context->profile->grants($requirement)) {
                return ConditionResult::noMatch('grant-not-held');
            }
        }

        return ConditionResult::match('grants-held');
    }

    public function toArray(): array
    {
        return [
            'type' => self::TYPE,
            'version' => self::VERSION,
            'keys' => array_map(fn (AccessRequirement $requirement) => $requirement->key(), $this->requirements),
        ];
    }
}
