<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\NavigationReader;
use App\Agents\Enums\MenuEntryState;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ListedPage;
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
        private readonly NumberedPages $pages,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'driver' => $schema->string()->max(80),
            'state' => $schema->string()->enum(array_column(MenuEntryState::cases(), 'value')),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->pages->answer(
            $this->name(),
            $arguments,
            fn (ToolArguments $initialArguments) => array_filter([
                'driver' => $initialArguments->optionalText('driver'),
                'state' => $initialArguments->optionalText('state'),
                'page' => $initialArguments->positiveIntegerOr('page', 1),
            ], fn (string|int|null $filter) => $filter !== null),
            fn (ToolArguments $filters) => $this->page($filters),
        );
    }

    private function page(ToolArguments $filters): ListedPage
    {
        $owner = ActorIdentity::of($this->admission->owner());
        $driver = $filters->optionalText('driver');
        $state = $filters->optionalText('state');
        $state = $state === null ? null : MenuEntryState::from($state);
        $page = $filters->positiveInteger('page');

        return new ListedPage(
            $this->navigation->menuEntries($owner, $driver, $state, $page),
            $page,
            NavigationReader::MENU_PAGE_SIZE,
            $this->navigation->menuEntryCount($owner, $driver, $state),
        );
    }
}
