<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\NavigationReader;
use App\Agents\Enums\MenuEntryState;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * Lists the entries in the journal owner's menu library, newest first.
 */
#[IsReadOnly]
#[Name('menu_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description(
    'The menu library: each entry\'s program, goal, builds proven on with a stale mark each, uses, last use and '
    .'state, newest first. Filter by program and state.',
)]
final class MenuListTool extends JournalReadTool
{
    public function __construct(
        private readonly JournalAdmission $admission,
        private readonly NavigationReader $navigation,
    ) {}

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
        $state = $arguments->optionalText('state');
        $menuEntries = $this->navigation->menuEntries(
            ActorIdentity::of($this->admission->owner()),
            $arguments->optionalText('program'),
            $state === null ? null : MenuEntryState::from($state),
            $page,
        );

        return ToolResult::ok(['page' => $page, 'entries' => $menuEntries], []);
    }
}
