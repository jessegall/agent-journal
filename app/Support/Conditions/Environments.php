<?php

declare(strict_types=1);

namespace App\Support\Conditions;

use App\Contracts\SkillCondition;
use App\Values\ConditionResult;
use App\Values\SkillContext;

/**
 * Matches a session in one of these environments.
 */
final readonly class Environments implements SkillCondition
{
    public const string TYPE = 'environments';

    public const int VERSION = 1;

    /**
     * @param  list<string>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        return in_array(
            $context->environment,
            $this->keys,
            true,
        ) ? ConditionResult::match('environment-listed') : ConditionResult::noMatch('environment-not-listed');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => self::VERSION, 'keys' => $this->keys];
    }
}
