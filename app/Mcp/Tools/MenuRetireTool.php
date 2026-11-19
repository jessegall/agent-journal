<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Agents\Commands\RetireMenuEntry;
use App\Agents\Enums\MenuEntryState;
use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * menu_retire: retires a menu library entry in the state the caller read, as the owner only may.
 */
#[Name('menu_retire')]
#[Description(
    'Retire a menu library entry in the state you read; the next uncertain point of any runtime asks the main agent '
    .'instead.',
)]
final class MenuRetireTool extends JournalWriteTool
{
    public function __construct(private readonly CommandBus $commands) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'entry' => $schema->string()->max(64)->required(),
            'expected_state' => $schema->string()->enum(array_column(MenuEntryState::cases(), 'value'))->required(),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $expected = $arguments->enum('expected_state', MenuEntryState::class);
        $this->commands->run(new RetireMenuEntry($arguments->text('entry'), $expected));

        return ToolResult::ok(['retired' => $arguments->text('entry')], []);
    }
}
