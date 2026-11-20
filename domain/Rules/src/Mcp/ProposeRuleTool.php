<?php

declare(strict_types=1);

namespace Domain\Rules\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Enums\RuleState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('rules_propose')]
#[Dispatches(ProposeRule::class)]
#[Description('Propose a new or replacement rule for the journal owner to review.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
final class ProposeRuleTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'text' => $schema->string()->max(2000)->required(),
            'reason' => $schema->string()->max(2000)->required(),
            'replaces_rule_id' => $schema->string()->max(26),
        ];
    }

    protected function command(ToolArguments $arguments): ProposeRule
    {
        return new ProposeRule(
            $arguments->text('text'),
            $arguments->text('reason'),
            $arguments->optionalUlid('replaces_rule_id'),
        );
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['rule_id' => $result, 'state' => RuleState::Proposed->value]);
    }
}
