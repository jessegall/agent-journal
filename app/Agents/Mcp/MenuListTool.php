<?php

declare(strict_types=1);

namespace App\Agents\Mcp;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\MenuEntryState;
use App\Agents\Models\MenuEntry;
use App\Agents\Values\MenuBuild;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * menu_list: the entries of the journal owner's menu library, newest first, a page at a time.
 */
#[Name('menu_list')]
#[Description(
    'The menu library: each entry\'s program, goal, builds proven on with a stale mark each, uses, last use and '
    .'state, newest first. Filter by program and state.',
)]
#[IsReadOnly]
final class MenuListTool extends JournalReadTool
{
    private const int PAGE_SIZE = 50;

    public function __construct(private readonly JournalAdmission $admission) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'program' => $schema->string()->max(80),
            'state' => $schema->string()->enum(array_column(MenuEntryState::cases(), 'value')),
            'page' => $schema->integer()->min(1),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $page = $arguments->positiveIntegerOr('page', 1);
        $query = MenuEntry::query()->ownedBy(ActorIdentity::of($this->admission->owner()))->recentFirst();
        $program = $arguments->optionalText('program');
        if ($program !== null) {
            $query->forProgram($program);
        }
        $state = $arguments->optionalText('state');
        if ($state !== null) {
            $query->where('state', MenuEntryState::from($state));
        }
        $entries = $query->offset(($page - 1) * self::PAGE_SIZE)->readLimit(self::PAGE_SIZE)->get();

        return ToolResult::ok(['page' => $page, 'entries' => $entries->map(fn (MenuEntry $entry) => [
            'id' => $entry->id,
            'program' => $entry->program,
            'goal' => $entry->goal_script,
            'parameters' => $entry->goal_parameters,
            'builds' => array_values(array_map(
                fn (MenuBuild $build) => ['build' => $build->build, 'stale' => $build->stale],
                $entry->builds(),
            )),
            'uses' => $entry->uses,
            'last_used_at' => $entry->last_used_at?->toIso8601String(),
            'state' => $entry->state->value,
        ])->all()], []);
    }
}
