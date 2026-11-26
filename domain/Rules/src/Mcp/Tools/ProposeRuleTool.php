<?php

declare(strict_types=1);

namespace Domain\Rules\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Projects\ProjectDestination;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Enums\RuleStatus;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;
use PhpOption\None;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('rules_propose')]
#[Dispatches(ProposeRuleCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Propose a new or replacement rule for the journal owner to review.')]
final class ProposeRuleTool extends JournalWriteTool
{
    public function __construct(private readonly ProjectDestination $destination) {}

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'text' => $schema->string()->max(2000)->required(),
            'reason' => $schema->string()->max(2000)->required(),
            'replaces_rule_id' => $this->optionalRecordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): ProposeRuleCommand
    {
        return new ProposeRuleCommand(
            $arguments->text('text'),
            $arguments->text('reason'),
            $this->destination->projectFor(None::create()),
            $arguments->optionalUlid('replaces_rule_id'),
        );
    }

    protected function present(mixed $ruleId): ToolResult
    {
        return ToolResult::ok([
            'rule_id' => $ruleId,
            'state' => RuleStatus::Proposed->value,
        ]);
    }
}
