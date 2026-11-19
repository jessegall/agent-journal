<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Profiles\Values\ProfileBase;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches a session whose launch profile starts from one of these built-in profiles; a profile-free session never
 * matches.
 */
final readonly class ProfileBases implements SkillCondition
{
    public const string TYPE = 'profile-bases';

    public const int VERSION = 1;

    /**
     * @param  list<ProfileBase>  $bases
     */
    public function __construct(
        public array $bases,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        if ($context->profile->isProfileFree()) {
            return ConditionResult::noMatch('profile-free');
        }

        return $context->profile->startsFromAnyOf($this->bases)
            ? ConditionResult::match('profile-base-listed')
            : ConditionResult::noMatch('profile-base-not-listed');
    }

    public function toArray(): array
    {
        return [
            'type' => self::TYPE,
            'version' => self::VERSION,
            'keys' => array_map(fn (ProfileBase $base) => $base->key, $this->bases),
        ];
    }
}
