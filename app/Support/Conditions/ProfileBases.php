<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\Skills\SkillCondition;
use App\Values\ConditionResult;
use App\Values\ProfileBase;
use App\Values\SkillContext;

/**
 * Matches a session whose start profile is built on one of these built-in profiles; a profile-free session never
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
