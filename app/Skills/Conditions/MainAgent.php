<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Agents\Enums\AgentRole;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Matches the main agent, by the role its agent was registered with; nothing in a request can claim it.
 */
final readonly class MainAgent implements SkillCondition
{
    public const string TYPE = 'main-agent';

    public const int VERSION = 1;

    public function evaluate(SkillContext $context): ConditionResult
    {
        return $context->agentRole === AgentRole::MainAgent ? ConditionResult::match('main-agent') : ConditionResult::noMatch('not-main-agent');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => self::VERSION];
    }
}
