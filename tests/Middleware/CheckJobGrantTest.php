<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Access\AccessSettings;
use App\Access\Contracts\ReadAdmission;
use App\Agents\Commands\RecordHeartbeat\RecordHeartbeatCommand;
use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Bus\CommandMiddleware\CheckJobGrant;
use App\Engine\Enums\CommandEffectType;
use App\Models\Records\AssignmentRecord;
use App\Profiles\Enums\AccessRuleType;
use App\Reads\ReadGrant;
use App\Support\CommandRegistry;
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
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A command runs inside a job only under the grant the job holds.
 */
#[TestsMiddleware(CheckJobGrant::class)]
final class CheckJobGrantTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The tables these tests commit to, emptied around each test.
     */
    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'tasks',
        'assignments',
        'command_receipts',
    ];

    private const string KEY = 'assignment-job-guard';

    /**
     * The domains these tests use beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, TasksDomain::class);
    }

    public function test_command_effect_is_read_at_registration_and_defaults_to_state_change(): void
    {
        $this->prepareJobGrantGuard();
        $registry = $this->app->make(CommandRegistry::class);

        $this->assertSame(CommandEffectType::Recovery, $registry->effectOf(RecordHeartbeatCommand::class));
        $this->assertSame(CommandEffectType::AssignmentChange, $registry->effectOf(AssignRecordCommand::class));
        $this->assertSame(CommandEffectType::StateChange, $registry->effectOf(ProposeRuleCommand::class));
    }

    public function test_a_reviewer_cannot_discover_or_call_hidden_writes_and_cannot_dispatch_work(): void
    {
        $this->prepareJobGrantGuard();
        $start = $this->journal->signedStart('Reader', 'read-only-helper');
        $tools = $this->journal->mcpRequest($start, 'tools/list')->assertOk()->json('result.tools');

        $this->assertContains('overview_read', array_column($tools, 'name'));
        $this->assertNotContains('skills_edit', array_column($tools, 'name'));
        $this->journal->mcpRequest($start, 'tools/call', ['name' => 'skills_edit', 'arguments' => (object) []])
            ->assertBadRequest()
            ->assertJsonPath('error.code', -32602);
        $this->assign($start, $this->journal->signedStart('Main agent', 'main-agent'), Task::factory()->create())
            ->assertForbidden()
            ->assertJsonPath('code', 'forbidden');
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_a_read_the_admission_refuses_is_refused_even_when_it_is_an_orientation_read(): void
    {
        $this->prepareJobGrantGuard();
        $admission = $this->createStub(ReadAdmission::class);
        $admission->method('assess')->willReturn(
            AccessDecision::refused(
                AccessRuleType::NotGranted,
                AgentText::of('core.access.profile_does_not_grant_pair'),
            ),
        );
        $this->app->instance(ReadAdmission::class, $admission);
        $reads = $this->app->make(ReadGrant::class);

        foreach (['overview_read', 'operations_read', 'capabilities_read', 'rules_list', 'rules_read'] as $name) {
            $this->assertFalse($reads->allows(new ReadRequest($name)));
        }

        $this->assertFalse($reads->allows(new ReadRequest('plans_list')));
        $this->journal->agentCall(
            $this->journal->signedStart('Main agent', 'main-agent'),
            'POST',
            '/agent/tasks/assigned',
            [],
        )->assertForbidden();
    }

    private function assign(TestStart $start, TestStart $recipient, Task $task): TestResponse
    {
        return $this->journal->agentCall($start, 'POST', '/agent/assignments/assign', [
            'record_type' => 'tasks.task',
            'record_id' => $task->id,
            'recipient_type' => 'agent',
            'recipient_id' => $recipient->agent->id,
            'request_key' => self::KEY,
        ]);
    }

    /**
     * The setup the JobGrantGuard cases share.
     */
    private function prepareJobGrantGuard(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
    }
}
