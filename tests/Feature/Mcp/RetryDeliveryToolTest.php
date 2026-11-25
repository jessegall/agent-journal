<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Models\Access\User;
use App\Models\Messages\OutstandingMessageRange;
use App\Support\Access\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An agent reaches the retry of a given-up chat delivery from its MCP tool and from the journal command, and both
 * pass through the command's own authorization, which only an operator passes.
 */
#[TimeLimit(seconds: 10, reason: 'It starts an agent and sends signed MCP frames and a command.')]
final class RetryDeliveryToolTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'outstanding_message_ranges',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, new AccessSettings(User::factory()->create()->id));
    }

    public function test_an_agent_that_is_no_operator_is_refused_on_the_tool_and_the_command(): void
    {
        $caller = TestStart::start('main-agent');
        $range = strtolower((string) Str::ulid());

        $this->sendMcp($caller, 'tools/call', [
            'name' => 'chat_retry_delivery',
            'arguments' => ['range_id' => $range, 'request_key' => 'retry-1'],
        ])->assertBadRequest();
        $this->runCommandsAs($caller);
        $this->artisan('chat:retry-delivery', ['range' => $range])->assertFailed();

        $this->assertSame(0, OutstandingMessageRange::query()->count());
    }
}
