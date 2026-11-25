<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Mcp;

use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;
use Domain\Memory\Mcp\Tools\SaveMemoryTool;
use Domain\Memory\MemoryDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent saves a memory with its weight.
 */
#[TestsMcpTool(SaveMemoryTool::class)]
final class SaveMemoryToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        return ToolCall::by($start)
            ->arguments([
                'text' => 'Run the phase tests once.',
                'weight' => 7,
                'request_key' => 'write-1',
            ])
            ->reply(SaveMemoryCommand::class, Str::ulid())
            ->expects(SaveMemoryCommand::class, [
                'text' => 'Run the phase tests once.',
                'weight' => 7,
            ]);
    }
}
