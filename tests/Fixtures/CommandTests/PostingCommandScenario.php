<?php

declare(strict_types=1);

namespace Tests\Fixtures\CommandTests;

use Tests\TestCase;

/**
 * The body of a command test that sends requests instead of running its command, which the command test rule names
 * line by line; it is only parsed, never run.
 */
abstract class PostingCommandScenario extends TestCase
{
    public function sendRequests(): void
    {
        $owner = $this->journal->owner()->ownerUser();
        $tasks = collect([1, 2])->map(fn (int $number) => $number)->all();
        $this->journal->owner();

        $this->actingAs($owner)
            ->postJson('/tasks', ['title' => 'Write it']);
        $this->journal->mcpTool('Writer', 'tasks_make', []);

        $this->assertSame([1, 2], $tasks);

        $this->journal
            ->route('POST', 'host.heartbeat');
    }
}
