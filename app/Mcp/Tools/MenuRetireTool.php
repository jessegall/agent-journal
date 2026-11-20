<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Agents\Commands\RetireMenuEntry;
use App\Agents\Enums\MenuEntryState;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * menu_retire: retires a menu library entry in the state the caller read, as the owner only may.
 */
#[IsIdempotent]
#[VisibleToProfiles]
#[Name('menu_retire')]
#[IsDestructive(true)]
#[Dispatches(RetireMenuEntry::class)]
#[Description(
    'Retire a menu library entry in the state you read; the next uncertain point of any runtime asks the main agent '
    .'instead.',
)]
final class MenuRetireTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'entry' => $schema->string()->max(64)->required(),
            'expected_state' => $schema->string()->enum(array_column(MenuEntryState::cases(), 'value'))->required(),
        ];
    }

    protected function command(ToolArguments $arguments): RetireMenuEntry
    {
        $expected = $arguments->enum('expected_state', MenuEntryState::class);

        return new RetireMenuEntry($arguments->text('entry'), $expected);
    }

    protected function present(mixed $menuEntryId): ToolResult
    {
        return ToolResult::ok(['retired' => $menuEntryId], []);
    }
}
