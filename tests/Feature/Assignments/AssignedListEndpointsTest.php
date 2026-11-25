<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Actors\CurrentActorSetter;
use App\Support\AssigneeIdentity;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The calling agent's own lists over a signed call: only what the credential's agent holds directly, paged and
 * filtered by the body, with an empty list as a plain success; a missing credential, a body naming someone else or a
 * page out of bounds is refused.
 */
final class AssignedListEndpointsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'plans',
        'assignments',
        'number_groups',
        'command_receipts',
        'inboxes',
        'inbox_members',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private TestStart $caller;

    private TestStart $other;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = $this->journal->owner()->ownerUser();
        $this->caller = TestStart::start('read-only-helper');
        $this->other = TestStart::start('read-only-helper');
        $this->journal->actAsUserId($owner->id);
    }

    public function test_the_caller_gets_only_the_tasks_and_plans_it_holds(): void
    {
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $held = $this->tasks()->task('Write the endpoint')->taskCalled('Write the endpoint');
        $others = $this->tasks()->task('Not mine')->taskCalled('Not mine');
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $writer->assign($held->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));
        $writer->assign($others->assignmentIdentity(), AssigneeIdentity::of($this->other->agent));
        $writer->assign($plan->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));

        $tasks = $this->listAs($this->caller, '/agent/tasks/assigned', ['per_page' => 10]);
        $plans = $this->listAs($this->caller, '/agent/plans/assigned', []);

        $tasks->assertOk()->assertJson(['total' => 1, 'page' => 1, 'perPage' => 10, 'cards' => [[
            'id' => $held->id,
            'title' => 'Write the endpoint',
            'state' => 'open',
            'holder' => ['type' => 'agent', 'id' => (string) $this->caller->agent->id, 'name' => 'Test agent'],
        ]]]);
        $this->assertCount(1, $tasks->json('cards'));
        $plans->assertOk()->assertJson(['total' => 1, 'cards' => [['id' => $plan->id, 'type' => 'build']]]);
    }

    public function test_an_agent_holding_nothing_gets_an_empty_success(): void
    {
        $this->listAs($this->caller, '/agent/tasks/assigned', [])->assertOk()->assertExactJson(
            ['cards' => [], 'page' => 1, 'perPage' => 20, 'total' => 0],
        );
    }

    public function test_a_missing_credential_a_body_naming_someone_else_or_a_bad_page_is_refused(): void
    {
        $body = '{}';
        $headers = $this->caller->serverHeaders($body, target: '/agent/tasks/assigned');
        unset($headers['HTTP_AUTHORIZATION']);

        $this->call('POST', '/agent/tasks/assigned', server: $headers, content: $body)->assertUnauthorized();
        $this->listAs(
            $this->caller,
            '/agent/tasks/assigned',
            ['agent' => $this->other->agent->id],
        )->assertUnprocessable();
        $this->listAs(
            $this->caller,
            '/agent/plans/assigned',
            ['session_id' => $this->other->session->id],
        )->assertUnprocessable();
        $this->listAs($this->caller, '/agent/tasks/assigned', ['per_page' => 101])->assertUnprocessable();
        $this->listAs($this->caller, '/agent/plans/assigned', ['page' => 0])->assertUnprocessable();
    }

    /**
     * @param  array<string, mixed>  $query
     */
    private function listAs(TestStart $start, string $path, array $query): TestResponse
    {
        $this->app->make(CurrentActorSetter::class)->clear();
        $body = json_encode((object) $query) ?: '{}';

        return $this->call(
            'POST',
            $path,
            server: $start->serverHeaders($body, 'call-'.bin2hex(random_bytes(4)), target: $path),
            content: $body,
        );
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
