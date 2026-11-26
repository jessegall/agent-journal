<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Agents\Values\ProviderKey;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches a session whose driver runs on one of these providers; a driver with no registered provider is
 * unavailable, never a match on an empty name.
 */
final readonly class Providers implements SkillCondition
{
    public const string TYPE = 'providers';

    public const int VERSION = 1;

    /**
     * @param  list<ProviderKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        if ($context->provider === null) {
            return ConditionResult::unavailable('provider-unavailable');
        }

        if (in_array(
            $context->provider->key,
            $this->keyTexts(),
            true,
        )) {
            return ConditionResult::match('provider-listed');
        }

        return ConditionResult::noMatch('provider-not-listed');
    }

    public function toArray(): array
    {
        return [
            'type' => self::TYPE,
            'version' => self::VERSION,
            'keys' => $this->keyTexts(),
        ];
    }

    /**
     * @return list<string>
     */
    private function keyTexts(): array
    {
        return array_map(fn (ProviderKey $key) => $key->key, $this->keys);
    }
}
