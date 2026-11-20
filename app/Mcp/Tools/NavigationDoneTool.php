<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Agents\Commands\ProveNavigation;
use App\Agents\Enums\NavigationCompletion;
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
 * navigation_done: the main agent says its rounds reached the goal or repaired the step, with the text that shows it.
 */
#[IsIdempotent]
#[IsDestructive(false)]
#[Name('navigation_done')]
#[Dispatches(ProveNavigation::class)]
#[Description(
    'Say a navigation request is done: completes goal (the whole goal shows) or step (only the stalled step is '
    .'repaired), and a proof, text that now shows on the screen and did not when the request was raised. The host '
    .'checks the proof on the live screen before anything counts.',
)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
final class NavigationDoneTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->max(26)->required(),
            'version' => $schema->integer()->min(1)->required(),
            'completes' => $schema->string()->enum(['goal', 'step'])->required(),
            'proof' => $schema->string()->max(200)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): ProveNavigation
    {
        return new ProveNavigation(
            $arguments->text('request'),
            $arguments->positiveInteger('version'),
            NavigationCompletion::from($arguments->text('completes')),
            $arguments->text('proof'),
        );
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['round' => $result->requestId, 'progress' => $result->progress->value], []);
    }
}
