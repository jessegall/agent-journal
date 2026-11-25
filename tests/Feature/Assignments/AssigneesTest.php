<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Exceptions\AgentNotAvailable;
use App\Exceptions\AssigneeUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\AssigneeIdentity;
use App\Support\IdListPage;
use App\Support\Lifecycle\AgentLifecycle;
use App\Support\Registry\AssignmentRegistry;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\UsesSecondConnection;
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
    use UsesSecondConnection;

    private const array TABLES = ['users', 'agents'];

    private User $owner;

    private Agent $builder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['name' => 'Jesse']);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = Agent::create('Builder', 'main-agent', $this->localProject());
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_the_owner_and_an_agent_with_the_same_id_are_different_holders(): void
    {
        $registry = $this->app->make(AssignmentRegistry::class);
        $sameId = $this->owner->id;
        Agent::query()->whereKey($this->builder->id)->update(['id' => $sameId]);

        $user = $registry->assigneeProvider(User::storedType())->requireEligible(
            new AssigneeIdentity(User::storedType(), $sameId),
        );
        $agent = $registry->assigneeProvider(Agent::storedType())->requireEligible(
            new AssigneeIdentity(Agent::storedType(), $sameId),
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
            fn () => $registry->assigneeProvider(User::storedType())->requireEligible(
                AssigneeIdentity::of($stranger),
            ),
            AssigneeUnavailable::class,
        );
        $this->assertThrows(
            fn () => $registry->assigneeProvider(Agent::storedType())->requireEligible(
                AssigneeIdentity::of($this->builder),
            ),
            AssigneeUnavailable::class,
        );
        $this->assertThrows(
            fn () => $registry->assigneeProvider(Agent::storedType())->requireEligible(
                new AssigneeIdentity(Agent::storedType(), TestIds::of(999999)),
            ),
            AssigneeUnavailable::class,
        );
    }

    public function test_eligible_lists_page_by_id_and_names_keep_a_retired_agent_and_show_no_email(): void
    {
        $registry = $this->app->make(AssignmentRegistry::class);
        $second = Agent::create('Reviewer', 'read-only-helper', $this->localProject());
        $retired = Agent::create('Gone', 'read-only-helper', $this->localProject());
        $retired->retireAt(CarbonImmutable::now());

        $firstPage = $registry->assigneeProvider(Agent::storedType())->eligible(new IdListPage(null, 1));
        $secondPage = $registry->assigneeProvider(Agent::storedType())->eligible(
            new IdListPage($firstPage->nextAfterId, 1),
        );
        $names = $registry->assigneeProvider(Agent::storedType())->names(
            [AssigneeIdentity::of($retired), AssigneeIdentity::of($this->builder)],
        );
        $users = $registry->assigneeProvider(User::storedType())->eligible(new IdListPage());

        $this->assertSame(['Builder'], array_map(fn ($name) => $name->name, $firstPage->assignees));
        $this->assertSame(['Reviewer'], array_map(fn ($name) => $name->name, $secondPage->assignees));
        $this->assertSame($second->id, $secondPage->assignees[0]->assignee->id);
        $this->assertNull($secondPage->nextAfterId);
        $this->assertSame(['Builder', 'Gone'], array_map(fn ($name) => $name->name, $names));
        $this->assertSame(['Jesse'], array_map(fn ($name) => $name->name, $users->assignees));
    }

    public function test_the_shared_lifecycle_lock_holds_off_retirement_until_it_commits(): void
    {
        $other = $this->otherConnection('1s');

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
        $other = $this->otherConnection('1s');

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
}
