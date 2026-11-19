<?php

declare(strict_types=1);

namespace App\Agents\Mcp;

use App\Agents\Commands\ProveNavigation;
use App\Agents\Enums\NavigationCompletion;
use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * navigation_done: the main agent says its rounds reached the goal or repaired the step, with the text that shows it.
 */
#[Name('navigation_done')]
#[Description(
    'Say a navigation request is done: completes goal (the whole goal shows) or step (only the stalled step is '
    .'repaired), and a proof, text that now shows on the screen and did not when the request was raised. The host '
    .'checks the proof on the live screen before anything counts.',
)]
final class NavigationDoneTool extends JournalWriteTool
{
    public function __construct(private readonly CommandBus $commands) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->max(26)->required(),
            'version' => $schema->integer()->min(1)->required(),
            'completes' => $schema->string()->enum(['goal', 'step'])->required(),
            'proof' => $schema->string()->max(200)->required(),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $receipt = $this->commands->run(new ProveNavigation(
            $arguments->text('request'),
            $arguments->positiveInteger('version'),
            NavigationCompletion::from($arguments->text('completes')),
            $arguments->text('proof'),
        ));

        return ToolResult::ok(['round' => $receipt->requestId, 'progress' => $receipt->progress->value], []);
    }
}
