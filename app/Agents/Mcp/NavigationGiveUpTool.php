<?php

declare(strict_types=1);

namespace App\Agents\Mcp;

use App\Agents\Commands\AbandonNavigation;
use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * navigation_give_up: the main agent gives up on a navigation request, saying why.
 */
#[Name('navigation_give_up')]
#[Description(
    'Give up on a navigation request, saying why: its key script ends and the runtime stays held for the person.',
)]
final class NavigationGiveUpTool extends JournalWriteTool
{
    public function __construct(private readonly CommandBus $commands) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->max(26)->required(),
            'version' => $schema->integer()->min(1)->required(),
            'reason' => $schema->string()->max(500)->required(),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $this->commands->run(new AbandonNavigation(
            $arguments->text('request'),
            $arguments->positiveInteger('version'),
            $arguments->text('reason'),
        ));

        return ToolResult::ok(['abandoned' => $arguments->text('request')], []);
    }
}
