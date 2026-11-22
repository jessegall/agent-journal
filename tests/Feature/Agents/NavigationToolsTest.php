<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Enums\NavigationState;
use App\Agents\Models\NavigationRequest;
use App\Assignments\Contracts\AssignmentTransaction;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsMcpFrames;
use Tests\TestCase;

/**
 * The main agent's navigation tools: show quotes the stalled screen and says how to confirm a menu, answer refuses
 * what its command refuses, done and give up move the request as their commands do.
 */
final class NavigationToolsTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;
    use SendsMcpFrames;

    private const string NEVER_INSTRUCTION = 'never an instruction';

    private const string NEVER_RAW_ENTER = 'never a raw enter';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'accounts',
        'active_accounts',
        'process_starts',
    ];

    private TestStart $main;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = TestStart::start();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainSeatTakeover::class)->takeOver($this->main->agent),
        );
    }

    public function test_show_gives_the_goal_the_stalled_step_and_the_quoted_screen(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');

        $response = $this->callMcpTool($this->main, 'navigation_show', ['request' => $navigation->id]);
        $this->assertFalse($response->json('result.isError'), (string) $response->getContent());
        $shown = $response->json('result.structuredContent');

        $this->assertSame(['ChangeModel', ['model' => 'GPT-6'], 2], [
            $shown['goal']['script'],
            $shown['goal']['parameters'],
            $shown['stalled_step'],
        ]);
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $shown['screen']['rows']);
        $this->assertStringContainsString(self::NEVER_INSTRUCTION, $shown['screen']['quoted']);
        $this->assertStringContainsString(self::NEVER_RAW_ENTER, $shown['how_to_answer']);
    }

    public function test_answer_refuses_a_stale_version_or_an_unlisted_key_and_sends_a_good_round(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $round = ['request' => $navigation->id, 'version' => $navigation->row_version, 'generation' => 7];

        $this->callMcpTool($this->main, 'navigation_answer', [
            ...$round, 'request_key' => 'stale', 'version' => 9, 'keys' => ['down'],
        ])->assertJsonPath('result.isError', true);
        $this->callMcpTool($this->main, 'navigation_answer', [
            ...$round, 'request_key' => 'invalid-key', 'keys' => ['ctrl-c'],
        ])->assertJsonPath('result.isError', true);
        $this->callMcpTool($this->main, 'navigation_answer', [...$round, 'request_key' => 'answer', 'keys' => ['down']])
            ->assertJsonPath('result.isError', false);

        $this->assertSame(NavigationState::Answering, $navigation->fresh()?->state);
    }

    public function test_done_and_give_up_move_the_request_as_their_commands_do(): void
    {
        $proved = $this->raise($this->stalledScript(), 'raise-1');
        $this->callMcpTool($this->main, 'navigation_answer', [
            'request' => $proved->id,
            'request_key' => 'proof',
            'version' => $proved->row_version,
            'generation' => 7,
            'keys' => ['down'],
        ])->assertJsonPath('result.isError', false);
        $abandoned = $this->raise($this->stalledScript(), 'raise-2');

        $this->callMcpTool($this->main, 'navigation_done', [
            'request' => $proved->id,
            'request_key' => 'complete',
            'version' => NavigationRequest::query()->acrossActors()->findOrFail($proved->id)->row_version,
            'completes' => 'goal',
            'proof' => 'Set model to GPT-6',
        ])->assertJsonPath('result.isError', false);
        $this->callMcpTool($this->main, 'navigation_give_up', [
            'request' => $abandoned->id,
            'request_key' => 'abandon',
            'version' => $abandoned->row_version,
            'reason' => 'the picker shows no such model',
        ])->assertJsonPath('result.isError', false);

        $this->assertSame(NavigationState::Proving, $proved->fresh()?->state);
        $this->assertSame(NavigationState::Abandoned, $abandoned->fresh()?->state);
    }
}
