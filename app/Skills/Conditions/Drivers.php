<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Drivers\Values\DriverKey;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches a session started with one of these programs; a start with no known program is unavailable.
 */
final readonly class Drivers implements SkillCondition
{
    public const string TYPE = 'programs';

    public const int VERSION = 1;

    /**
     * @param  list<DriverKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        if ($context->driver === null) {
            return ConditionResult::unavailable('program-unavailable');
        }

        return in_array(
            $context->driver->key,
            $this->keyTexts(),
            true,
        ) ? ConditionResult::match('program-listed') : ConditionResult::noMatch('program-not-listed');
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
        return array_map(fn (DriverKey $key) => $key->key, $this->keys);
    }
}
