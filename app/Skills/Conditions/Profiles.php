<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Profiles\Values\ProfileKey;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches a session launched with one of these profiles, by stable key; a profile-free session never matches.
 */
final readonly class Profiles implements SkillCondition
{
    public const string TYPE = 'profiles';

    public const int VERSION = 1;

    /**
     * @param  list<ProfileKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        if ($context->profile->isProfileFree()) {
            return ConditionResult::noMatch('profile-free');
        }

        return $context->profile->hasKeyIn($this->keyTexts())
            ? ConditionResult::match('profile-listed')
            : ConditionResult::noMatch('profile-not-listed');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => self::VERSION, 'keys' => $this->keyTexts()];
    }

    /**
     * @return list<string>
     */
    private function keyTexts(): array
    {
        return array_map(fn (ProfileKey $key) => $key->key, $this->keys);
    }
}
