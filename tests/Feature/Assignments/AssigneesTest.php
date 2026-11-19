<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Enums\ActorType;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Page;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Database\Connection;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Users and agents as holders of work: the admitted owner and every agent that is not retired may receive work, an
 * agent and a user with the same id stay apart, names are display names, and the agent lifecycle lock makes
 * retirement wait for work given to an agent and the other way round.
 */
#[TimeLimit(seconds: 5, reason: 'A second connection waits up to its one second lock timeout.')]
final class AssigneesTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents'];

    private User $owner;

    private Agent $builder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['name' => 'Jesse']);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = Agent::named('Builder', 'main-agent');
        $this->startUserRequestAs($this->owner->id);
    }

    protected function tearDown(): void
    {
        if ($this->app->make('config')->has('database.connections.assignees_other')) {
            DB::connection('assignees_other')->disconnect();
        }

        parent::tearDown();
    }

    public function test_the_owner_and_an_agent_with_the_same_id_are_different_holders(): void
    {
        $registry = $this->app->make(AssignmentRegistry::class);
        $sameId = $this->owner->id;
        Agent::query()->whereKey($this->builder->id)->update(['id' => $sameId]);

        $user = $registry->assigneeProvider(ActorType::User->value)->requireEligible(
            new AssigneeIdentity(ActorType::User->value, $sameId),
        );
        $agent = $registry->assigneeProvider(ActorType::Agent->value)->requireEligible(
            new AssigneeIdentity(ActorType::Agent->value, $sameId),
        );

        $this->assertInstanceOf(User::class, $user);
        $this->assertInstanceOf(Agent::class, $agent);
    }

    public function test_a_user_the_journal_does_not_admit_and_a_retired_agent_cannot_receive_work(): void
    {
        $registry = $this->app->make(AssignmentRegistry::class);
        $stranger = User::factory()->create();
        $this->builder->retireAt(CarbonImmutable::now());

        $this->assertThrows(
            fn () => $registry->assigneeProvider(ActorType::User->value)->requireEligible(
                AssigneeIdentity::of($stranger),
            ),
            AssigneeUnavailable::class,
        );
        $this->assertThrows(
            fn () => $registry->assigneeProvider(ActorType::Agent->value)->requireEligible(
                AssigneeIdentity::of($this->builder),
            ),
            AssigneeUnavailable::class,
        );
        $this->assertThrows(
            fn () => $registry->assigneeProvider(ActorType::Agent->value)->requireEligible(
                new AssigneeIdentity(ActorType::Agent->value, TestIds::of(999999)),
            ),
            AssigneeUnavailable::class,
        );
    }

    public function test_eligible_lists_page_by_id_and_names_keep_a_retired_agent_and_show_no_email(): void
    {
        $registry = $this->app->make(AssignmentRegistry::class);
        $second = Agent::named('Reviewer', 'read-only-helper');
        $retired = Agent::named('Gone', 'read-only-helper');
        $retired->retireAt(CarbonImmutable::now());

        $firstPage = $registry->assigneeProvider(ActorType::Agent->value)->eligible(new Page(null, 1));
        $secondPage = $registry->assigneeProvider(ActorType::Agent->value)->eligible(
            new Page($firstPage->nextAfterId, 1),
        );
        $names = $registry->assigneeProvider(ActorType::Agent->value)->names(
            [AssigneeIdentity::of($retired), AssigneeIdentity::of($this->builder)],
        );
        $users = $registry->assigneeProvider(ActorType::User->value)->eligible(new Page());

        $this->assertSame(['Builder'], array_map(fn ($name) => $name->name, $firstPage->assignees));
        $this->assertSame(['Reviewer'], array_map(fn ($name) => $name->name, $secondPage->assignees));
        $this->assertSame($second->id, $secondPage->assignees[0]->assignee->id);
        $this->assertNull($secondPage->nextAfterId);
        $this->assertSame(['Builder', 'Gone'], array_map(fn ($name) => $name->name, $names));
        $this->assertSame(['Jesse'], array_map(fn ($name) => $name->name, $users->assignees));
    }

    public function test_the_shared_lifecycle_lock_holds_off_retirement_until_it_commits(): void
    {
        $other = $this->otherConnection();

        DB::transaction(function () use ($other): void {
            $this->app->make(AgentLifecycle::class)->lockShared($this->builder->id);

            $this->assertThrows(
                fn () => $other->select('SELECT id FROM agents WHERE id = ? FOR UPDATE NOWAIT', [$this->builder->id]),
                QueryException::class,
            );
        });

        $this->assertCount(
            1,
            $other->select('SELECT id FROM agents WHERE id = ? FOR UPDATE NOWAIT', [$this->builder->id]),
        );
    }

    public function test_the_exclusive_lifecycle_lock_holds_off_new_work_and_a_retired_agent_is_refused(): void
    {
        $other = $this->otherConnection();

        DB::transaction(function () use ($other): void {
            $this->app->make(AgentLifecycle::class)->lockExclusive($this->builder->id);

            $this->assertThrows(
                fn () => $other->select('SELECT id FROM agents WHERE id = ? FOR SHARE NOWAIT', [$this->builder->id]),
                QueryException::class,
            );
        });

        $this->builder->retireAt(CarbonImmutable::now());

        $this->assertThrows(
            fn () => $this->app->make(AgentLifecycle::class)->lockShared($this->builder->id),
            AgentNotAvailable::class,
        );
    }

    private function otherConnection(): Connection
    {
        $config = $this->app->make('config');
        $config->set(
            'database.connections.assignees_other',
            $config->get('database.connections.'.$config->get('database.default')),
        );

        $other = DB::connection('assignees_other');
        $other->statement("SET lock_timeout = '1s'");

        return $other;
    }
}
