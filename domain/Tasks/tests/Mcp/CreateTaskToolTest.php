<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\Mcp\Tools\CreateTaskTool;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent files a task with a title and a brief and is given its number.
 */
#[TestsMcpTool(CreateTaskTool::class)]
final class CreateTaskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        return ToolCall::by($start)
            ->arguments([
                'title' => 'Ship the dock',
                'brief' => 'Dock the source beside the chat.',
                'request_key' => 'tasks-1',
            ])
            ->reply(CreateTaskCommand::class, (string) Str::ulid())
            ->expects(CreateTaskCommand::class, [
                'title' => 'Ship the dock',
                'brief' => 'Dock the source beside the chat.',
            ]);
    }
}
