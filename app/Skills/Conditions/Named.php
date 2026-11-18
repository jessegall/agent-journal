<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * A condition type a domain or module registers under an owner-prefixed key, such as plans.active-plan, with the
 * schema version of its parameters. While no installed owner registers the key it is unavailable, and its key,
 * version and parameters are kept as written.
 */
final readonly class Named implements SkillCondition
{
    public const string TYPE = 'named';

    /**
     * @param  array<string, mixed>  $parameters
     */
    public function __construct(
        public string $key,
        public int $version,
        public array $parameters,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        return ConditionResult::unavailable('condition-missing');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => $this->version, 'key' => $this->key, 'parameters' => $this->parameters];
    }
}
