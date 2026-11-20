<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Agents\Commands\AbandonNavigation;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * navigation_give_up: the main agent gives up on a navigation request, saying why.
 */
#[IsIdempotent]
#[IsDestructive(true)]
#[Name('navigation_give_up')]
#[Dispatches(AbandonNavigation::class)]
#[Description(
    'Give up on a navigation request, saying why: its key script ends and the runtime stays held for the person.',
)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
final class NavigationGiveUpTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->max(26)->required(),
            'version' => $schema->integer()->min(1)->required(),
            'reason' => $schema->string()->max(500)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): AbandonNavigation
    {
        return new AbandonNavigation(
            $arguments->text('request'),
            $arguments->positiveInteger('version'),
            $arguments->text('reason'),
        );
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['abandoned' => $result], []);
    }
}
