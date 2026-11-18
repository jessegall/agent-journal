<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Profiles\Enums\ProfileType;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches a session whose launch profile has one of these types; a profile-free session never matches.
 */
final readonly class AgentTypes implements SkillCondition
{
    public const string TYPE = 'agent-types';

    public const int VERSION = 1;

    /**
     * @param  list<ProfileType>  $types
     */
    public function __construct(
        public array $types,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        if ($context->profile->isProfileFree()) {
            return ConditionResult::noMatch('profile-free');
        }

        return $context->profile->hasTypeIn($this->types)
            ? ConditionResult::match('agent-type-listed')
            : ConditionResult::noMatch('agent-type-not-listed');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => self::VERSION, 'keys' => array_map(fn (ProfileType $type) => $type->value, $this->types)];
    }
}
