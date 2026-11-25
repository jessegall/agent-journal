<?php

declare(strict_types=1);

namespace Tests\Unit\Search;

use App\Contracts\Authorization\ReadGrant;
use App\Data\Profiles\ProfileAuthorization;
use App\Data\Profiles\ScopedRead;
use App\Enums\Profiles\AuthorizationType;
use App\Enums\Search\SearchSurface;
use App\Exceptions\ReadGrantRefused;
use App\Support\ActorContext;
use App\Values\AllowedNames;
use App\Values\ReadRequest;
use App\Values\SearchReader;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Domain\Tasks\Support\TaskSearchAccess;
use PHPUnit\Framework\TestCase;

/**
 * An agent holding tasks_read for task A only may search Tasks, sees only A among its admitted ids and may open
 * only A; a signed-in user reads every task; a grant withdrawn after display refuses the open.
 */
final class TaskSearchAccessTest extends TestCase
{
    private const string TASK_A = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    private const string TASK_B = '01ARZ3NDEKTSV4RRFFQ69G5FAB';

    private const string ACTOR_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAC';

    public function test_a_read_scoped_to_task_a_names_only_a(): void
    {
        $authorization = new ProfileAuthorization(AuthorizationType::Policies, [], [], [
            new ScopedRead(TaskReadResult::TOOL, self::TASK_A),
        ]);

        $targets = $authorization->readTargets(TaskReadResult::TOOL);

        $this->assertTrue($targets->isRestricted());
        $this->assertSame([self::TASK_A], $targets->names());
        $this->assertTrue($authorization->readTargets('plans_read')->hasNoneAllowed());
    }

    public function test_an_unscoped_read_names_every_task(): void
    {
        $authorization = new ProfileAuthorization(AuthorizationType::Policies, [], [], [
            new ScopedRead(TaskReadResult::TOOL),
        ]);

        $this->assertFalse($authorization->readTargets(TaskReadResult::TOOL)->isRestricted());
    }

    public function test_the_source_is_discovered_without_a_stand_in_task_id(): void
    {
        $access = new TaskSearchAccess($this->grantFor([self::TASK_A]));

        $read = $access->agentRead();

        $this->assertSame(TaskReadResult::TOOL, $read->name);
        $this->assertTrue($read->isDiscovery);
        $this->assertNull($read->target);
    }

    public function test_an_a_only_agent_admits_a_and_not_b(): void
    {
        $access = new TaskSearchAccess($this->grantFor([self::TASK_A]));
        $agent = new SearchReader(ActorContext::forAgent(self::ACTOR_ID), SearchSurface::AgentTool);

        $constraints = $access->constraints($agent);

        $this->assertTrue($constraints->admitsRecord(self::TASK_A));
        $this->assertFalse($constraints->admitsRecord(self::TASK_B));
        $this->assertTrue($access->admitsOpen($agent, self::TASK_A));
        $this->assertFalse($access->admitsOpen($agent, self::TASK_B));
    }

    public function test_a_user_reads_both_tasks(): void
    {
        $access = new TaskSearchAccess($this->grantFor([]));
        $user = new SearchReader(ActorContext::forUser(self::ACTOR_ID), SearchSurface::Palette);

        $constraints = $access->constraints($user);

        $this->assertTrue($access->canUserSearch($user->actor));
        $this->assertTrue($constraints->admitsRecord(self::TASK_A));
        $this->assertTrue($constraints->admitsRecord(self::TASK_B));
        $this->assertTrue($access->admitsOpen($user, self::TASK_B));
    }

    public function test_a_grant_withdrawn_after_display_refuses_the_open(): void
    {
        $grant = new class implements ReadGrant
        {
            public bool $held = true;

            public function allows(ReadRequest $request): bool
            {
                return $this->held && $request->target === '01ARZ3NDEKTSV4RRFFQ69G5FAA';
            }

            public function assertAllowed(ReadRequest $request): void
            {
                if (! $this->allows($request)) {
                    throw ReadGrantRefused::because('withdrawn');
                }
            }

            public function allowedTargets(string $name): AllowedNames
            {
                return AllowedNames::only($this->held ? ['01ARZ3NDEKTSV4RRFFQ69G5FAA'] : []);
            }
        };
        $access = new TaskSearchAccess($grant);
        $agent = new SearchReader(ActorContext::forAgent(self::ACTOR_ID), SearchSurface::AgentTool);

        $this->assertTrue($access->admitsOpen($agent, self::TASK_A));
        $grant->held = false;

        $this->assertFalse($access->admitsOpen($agent, self::TASK_A));
    }

    public function test_the_tool_and_search_ask_the_same_targeted_read(): void
    {
        $read = TaskReadResult::requestFor(self::TASK_A);

        $this->assertSame(TaskReadResult::TOOL, $read->name);
        $this->assertSame(['task_id' => self::TASK_A], $read->arguments);
        $this->assertSame(self::TASK_A, $read->target);
    }

    /**
     * @param  list<string>  $taskIds
     */
    private function grantFor(array $taskIds): ReadGrant
    {
        $grant = $this->createStub(ReadGrant::class);
        $grant->method('allowedTargets')->willReturn(AllowedNames::only($taskIds));
        $grant->method('allows')->willReturnCallback(
            fn (ReadRequest $request): bool => $request->target !== null && in_array($request->target, $taskIds, true),
        );

        return $grant;
    }
}
