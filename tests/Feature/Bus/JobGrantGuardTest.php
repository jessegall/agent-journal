<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Agents\Contracts\ReadAdmission;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Support\ReadGrant;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\ReadRequest;
use App\Agents\Values\StackTarget;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\CommandRegistry;
use App\Bus\Values\RecoveryCall;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\States\AnsweringMessageState;
use App\Hooks\Contracts\StackPermission;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\Frame;
use App\Hooks\Stack\StackVerdict;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Domain\Rules\Commands\ProposeRule;
use Domain\Tasks\Models\Task;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestActors;
use Tests\TestCase;

final class JobGrantGuardTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const string KEY = 'assignment-job-guard';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'tasks',
        'assignments',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
    }

    public function test_command_effect_is_read_at_registration_and_defaults_to_state_change(): void
    {
        $registry = $this->app->make(CommandRegistry::class);

        $this->assertSame(CommandEffectType::Recovery, $registry->effectOf(ReplyToMessage::class));
        $this->assertSame(CommandEffectType::AssignmentChange, $registry->effectOf(AssignRecord::class));
        $this->assertSame(CommandEffectType::StateChange, $registry->effectOf(ProposeRule::class));
    }

    public function test_a_live_answering_state_names_the_message_to_read(): void
    {
        $frame = new Frame(
            'answering',
            new StateReference('communication.answering', NoSubject::None),
            new AnsweringMessageState('message-id', true),
            CarbonImmutable::now(),
        );
        $stack = new AgentStack([$frame], $this->createStub(StateFactory::class), new StackTarget('agent-1', 'session-1'));

        $permission = $stack->permission();

        $this->assertFalse($permission->allowed);
        $this->assertEquals(new RecoveryCall('messages_read', ['message_id' => 'message-id']), $permission->recovery);
    }

    public function test_a_blocked_stack_refuses_a_signed_write_and_replays_the_recovery_action(): void
    {
        $start = TestStart::start();
        $recipient = TestStart::start();
        $task = Task::factory()->create();
        $this->mock(StackPermission::class)->shouldReceive('allows')->twice()->andReturn(
            StackVerdict::refuse('A reply is due.', new RecoveryCall('messages_read', ['message_id' => 'pending'])),
        );

        for ($attempt = 0; $attempt < 2; $attempt++) {
            $this->assign($start, $recipient, $task)
                ->assertConflict()
                ->assertJsonPath('code', 'state_blocked')
                ->assertJsonPath('details.next_action.tool', 'messages_read')
                ->assertJsonPath('details.next_action.arguments.message_id', 'pending');
        }

        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_reviewer_cannot_discover_or_call_hidden_writes_and_cannot_dispatch_work(): void
    {
        $start = TestStart::start('read-only-helper');
        $tools = $this->sendMcp($start, 'tools/list')->assertOk()->json('result.tools');

        $this->assertContains('overview_read', array_column($tools, 'name'));
        $this->assertNotContains('skills_edit', array_column($tools, 'name'));
        $this->sendMcp($start, 'tools/call', ['name' => 'skills_edit', 'arguments' => (object) []])
            ->assertBadRequest()
            ->assertJsonPath('error.code', -32602);
        $this->assign($start, TestStart::start(), Task::factory()->create())
            ->assertForbidden()
            ->assertJsonPath('code', 'forbidden');
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_read_the_admission_refuses_is_refused_even_when_it_is_an_orientation_read(): void
    {
        $admission = $this->createStub(ReadAdmission::class);
        $admission->method('assess')->willReturn(AccessDecision::refused(AccessRuleType::NotGranted, 'Refused.'));
        $this->app->instance(ReadAdmission::class, $admission);
        $reads = $this->app->make(ReadGrant::class);

        foreach (['overview_read', 'operations_read', 'capabilities_read', 'rules_list', 'rules_read'] as $name) {
            $this->assertFalse($reads->allows(new ReadRequest($name)));
        }

        $this->assertFalse($reads->allows(new ReadRequest('plans_list')));
        $this->signed(TestStart::start(), '/agent/tasks/assigned', [])->assertForbidden();
    }

    private function assign(TestStart $start, TestStart $recipient, Task $task): TestResponse
    {
        return $this->signed($start, '/agent/assignments/assign', [
            'record_type' => 'tasks.task',
            'record_id' => $task->id,
            'recipient_type' => 'agent',
            'recipient_id' => $recipient->agent->id,
            'request_key' => self::KEY,
        ]);
    }
}
