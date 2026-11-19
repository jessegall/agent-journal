<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Programs\Values\ProgramKey;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches a session launched with one of these programs; a launch with no known program is unavailable.
 */
final readonly class Programs implements SkillCondition
{
    public const string TYPE = 'programs';

    public const int VERSION = 1;

    /**
     * @param  list<ProgramKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        if ($context->program === null) {
            return ConditionResult::unavailable('program-unavailable');
        }

        return in_array(
            $context->program->key,
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
        return array_map(fn (ProgramKey $key) => $key->key, $this->keys);
    }
}
