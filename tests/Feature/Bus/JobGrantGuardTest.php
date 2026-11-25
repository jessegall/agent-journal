<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Commands\Agents\RecordHeartbeat\RecordHeartbeatCommand;
use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Admission\ReadAdmission;
use App\Enums\Engine\CommandEffectType;
use App\Enums\Profiles\AccessRuleType;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\CommandRegistry;
use App\Support\ReadGrant;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\ReadRequest;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\TestActors;
use Tests\TestCase;

final class JobGrantGuardTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedPayloads;

    private const string KEY = 'assignment-job-guard';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'tasks',
        'assignments',
        'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, TasksDomain::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
    }

    public function test_command_effect_is_read_at_registration_and_defaults_to_state_change(): void
    {
        $registry = $this->app->make(CommandRegistry::class);

        $this->assertSame(CommandEffectType::Recovery, $registry->effectOf(RecordHeartbeatCommand::class));
        $this->assertSame(CommandEffectType::AssignmentChange, $registry->effectOf(AssignRecordCommand::class));
        $this->assertSame(CommandEffectType::StateChange, $registry->effectOf(ProposeRuleCommand::class));
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
        $admission->method('assess')->willReturn(AccessDecision::refused(AccessRuleType::NotGranted, AgentText::of('core.access.profile_does_not_grant_pair')));
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
