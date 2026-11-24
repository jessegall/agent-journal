<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Contracts\Assignments\AssignedWorkProvider;
use App\Contracts\Assignments\AssignedWorkResolver;
use App\Contracts\Assignments\AssignmentPool;
use App\Contracts\Assignments\AssignmentPoolFactory;
use App\Contracts\Assignments\AssignmentQuery;
use App\Contracts\Assignments\AutoAssigner;
use App\Contracts\Assignments\AutoAssignmentProvider;
use App\Enums\PoolInputType;
use App\Enums\PoolMembersType;
use App\Exceptions\InvalidRecordIds;
use App\Support\AutoAssignerDefinition;
use App\Support\OrderedRecordIds;
use App\Support\PoolDefinition;
use App\Support\PoolDescription;
use App\Support\PoolMembers;
use App\Support\PoolReference;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * The auto-assignment values refuse a repeated id and a list past 1,000 ids without echoing an id, keep the order
 * they were given, and Core exports every auto-assignment contract and value so a domain may import them.
 */
final class AutoAssignmentValuesTest extends TestCase
{
    private const string HOSTILE_ID = 'drop table tasks';

    public function test_ordered_pool_members_keep_their_order(): void
    {
        $members = PoolMembers::ordered([TestIds::of(3), TestIds::of(1), TestIds::of(2)]);

        $this->assertSame(PoolMembersType::Ordered, $members->type);
        $this->assertSame([TestIds::of(3), TestIds::of(1), TestIds::of(2)], $members->ids->ids);
    }

    public function test_all_pool_members_list_no_ids(): void
    {
        $members = PoolMembers::all();

        $this->assertSame(PoolMembersType::All, $members->type);
        $this->assertSame([], $members->ids->ids);
    }

    public function test_ordered_pool_members_refuse_a_repeated_id_without_naming_it(): void
    {
        try {
            PoolMembers::ordered([TestIds::of(1), TestIds::of(2), TestIds::of(1)]);
            $this->fail('A repeated id was accepted.');
        } catch (InvalidRecordIds $refusal) {
            $this->assertStringNotContainsString(TestIds::of(1), $refusal->getMessage());
        }
    }

    public function test_ordered_pool_members_take_1000_ids_and_refuse_1001(): void
    {
        $this->assertCount(1000, PoolMembers::ordered(self::ids(1000))->ids->ids);

        $this->expectException(InvalidRecordIds::class);
        $this->expectExceptionMessage(InvalidRecordIds::tooMany(1001, 1000)->getMessage());

        PoolMembers::ordered(self::ids(1001));
    }

    public function test_ordered_record_ids_refuse_something_other_than_a_ulid_without_echoing_it(): void
    {
        try {
            new OrderedRecordIds([self::HOSTILE_ID]);
            $this->fail('A word was accepted as a record id.');
        } catch (InvalidRecordIds $refusal) {
            $this->assertStringNotContainsString(self::HOSTILE_ID, $refusal->getMessage());
        }
    }

    public function test_a_pool_reference_refuses_repeated_ids(): void
    {
        $this->expectException(InvalidRecordIds::class);

        new PoolReference('tasks.named', null, [TestIds::of(1), TestIds::of(1)]);
    }

    public function test_a_pool_reference_refuses_more_than_1000_ids(): void
    {
        $this->expectException(InvalidRecordIds::class);

        new PoolReference('tasks.named', null, self::ids(1001));
    }

    public function test_a_pool_reference_keeps_its_key_target_and_ids(): void
    {
        $plan = TestActors::record('plans.plan', 7);
        $reference = new PoolReference('plans.tasks', $plan, []);
        $named = new PoolReference('tasks.named', null, [TestIds::of(2), TestIds::of(1)]);

        $this->assertSame('plans.tasks', $reference->type);
        $this->assertSame($plan, $reference->target);
        $this->assertSame([], $reference->recordIds);
        $this->assertSame([TestIds::of(2), TestIds::of(1)], $named->recordIds);
    }

    /**
     * @return list<string>
     */
    private static function ids(int $count): array
    {
        return array_map(fn (int $number) => TestIds::of($number), range(1, $count));
    }
}
