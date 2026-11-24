<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\Skills\SkillCondition;
use App\Values\ConditionResult;
use App\Values\DriverKey;
use App\Values\SkillContext;

/**
 * Matches a session started with one of these drivers; a start with no known driver is unavailable.
 */
final readonly class Drivers implements SkillCondition
{
    public const string TYPE = 'drivers';

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
            return ConditionResult::unavailable('driver-unavailable');
        }

        if (in_array(
            $context->driver->key,
            $this->keyTexts(),
            true,
        )) {
            return ConditionResult::match('driver-listed');
        }

        return ConditionResult::noMatch('driver-not-listed');
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
