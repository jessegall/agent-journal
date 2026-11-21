<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Stored\StoredAccessPolicy;
use App\Agents\Stored\StoredExecutionPolicy;
use App\Agents\Stored\StoredStopConditions;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\HostAccess;
use App\Agents\Values\OperationGrant;
use App\Agents\Values\ResourceRequest;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Operations\Enums\AccessType;
use App\Processes\Values\ProcessGrants;
use Tests\TestCase;

/**
 * The stored shapes of the access policy, stop conditions and execution policy write the JSON column and read the
 * same policy back from it.
 */
final class StoredPolicyShapesTest extends TestCase
{
    public function test_an_access_policy_reads_back_as_it_was_stored(): void
    {
        $access = new AccessPolicy(
            [HostAccess::root('.', [AccessType::Read, AccessType::Execute])],
            [HostAccess::destination('example.test', [AccessType::Network])],
            ProcessGrants::readingOnly(),
            [new OperationGrant('tasks.show', [ResourceRequest::record('tasks/1')])],
            ['tasks.delete'],
        );

        $stored = StoredAccessPolicy::fromAccessPolicy($access)->toArray();
        $read = StoredAccessPolicy::from($stored)->toAccessPolicy();

        $this->assertSame(['read', 'execute'], $stored['paths'][0]['access']);
        $this->assertEquals($access, $read);
    }

    public function test_stop_conditions_read_back_as_they_were_stored(): void
    {
        $conditions = StopConditions::make([StopCondition::cleanWorktree()], 40);

        $stored = StoredStopConditions::fromStopConditions($conditions)->toArray();
        $read = StoredStopConditions::from($stored)->toStopConditions();

        $this->assertSame(10, $stored['conditions'][0]['timeout_seconds']);
        $this->assertEquals($conditions, $read);
    }

    public function test_an_execution_policy_reads_back_as_it_was_stored(): void
    {
        $execution = ExecutionPolicy::make(
            ExecutionModeType::ProtectedHost,
            null,
            '/workspace',
            ExecutionBudgets::defaults(),
            ['egress'],
        );

        $stored = StoredExecutionPolicy::fromExecutionPolicy($execution)->toArray();
        $read = StoredExecutionPolicy::from($stored)->toExecutionPolicy();

        $this->assertSame('protected_host', $stored['mode']);
        $this->assertSame(2, $stored['budgets']['cpu_cores']);
        $this->assertEquals($execution, $read);
    }
}
