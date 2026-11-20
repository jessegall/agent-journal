<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssignmentPool;
use App\Assignments\Contracts\AssignmentPoolFactory;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Contracts\AutoAssigner;
use App\Assignments\Contracts\AutoAssignmentProvider;
use App\Assignments\Enums\PoolInputType;
use App\Assignments\Enums\PoolMembersType;
use App\Assignments\Exceptions\InvalidRecordIds;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\OrderedRecordIds;
use App\Assignments\Support\PoolDefinition;
use App\Assignments\Support\PoolDescription;
use App\Assignments\Support\PoolMembers;
use App\Assignments\Support\PoolReference;
use App\CoreApi;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * The auto-assignment values refuse a repeated id and a list past 1,000 ids without echoing an id, keep the order
 * they were given, and Core exports every auto-assignment contract and value so a domain may import them.
 */
final class AutoAssignmentValuesTest extends TestCase
{
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
        $this->expectExceptionMessage('at most 1000 ids; this one holds 1001');

        PoolMembers::ordered(self::ids(1001));
    }

    public function test_ordered_record_ids_refuse_something_other_than_a_ulid_without_echoing_it(): void
    {
        try {
            new OrderedRecordIds(['drop table tasks']);
            $this->fail('A word was accepted as a record id.');
        } catch (InvalidRecordIds $refusal) {
            $this->assertStringNotContainsString('drop table', $refusal->getMessage());
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

    public function test_core_exports_the_auto_assignment_contracts_values_and_exception(): void
    {
        $exports = CoreApi::exports();

        $contracts = [
            AutoAssigner::class,
            AssignmentPool::class,
            AssignmentPoolFactory::class,
            AssignedWorkResolver::class,
            AssignedWorkProvider::class,
            AssignmentQuery::class,
            AutoAssignmentProvider::class,
        ];
        $values = [
            OrderedRecordIds::class,
            PoolReference::class,
            PoolMembers::class,
            PoolMembersType::class,
            PoolDefinition::class,
            PoolDescription::class,
            PoolInputType::class,
            AutoAssignerDefinition::class,
        ];

        foreach ($contracts as $contract) {
            $this->assertContains($contract, $exports->contracts);
        }

        foreach ($values as $value) {
            $this->assertContains($value, $exports->values);
        }

        $this->assertContains(InvalidRecordIds::class, $exports->exceptions);
    }

    /**
     * @return list<string>
     */
    private static function ids(int $count): array
    {
        return array_map(fn (int $number) => TestIds::of($number), range(1, $count));
    }
}
