<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Domain\Reminders\Enums\ReminderStatus;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\RemindersDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsMcpFrames;
use Tests\TestCase;

/**
 * An agent makes a reminder for itself through the journal's tools and finishes it the same way.
 */
final class ReminderToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'reminders', 'command_receipts'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RemindersDomain::class);
    }

    public function test_an_agent_creates_a_reminder_and_finishes_it_through_the_tools(): void
    {
        $caller = TestStart::start();

        $reminderId = $this->callMcpTool($caller, 'reminders_create', [
            'title' => 'Check the server install',
            'due_at' => '2026-11-24 09:00',
            'request_key' => 'create-reminder',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.reminder_id');

        $this->assertSame(ReminderStatus::Open, Reminder::query()->withoutGlobalScopes()->findOrFail($reminderId)->status);

        $this->callMcpTool($caller, 'reminders_finish', [
            'reminder_id' => $reminderId,
            'request_key' => 'finish-reminder',
        ])->assertJsonPath('result.isError', false);

        $this->assertSame(ReminderStatus::Done, Reminder::query()->withoutGlobalScopes()->findOrFail($reminderId)->status);
    }
}
