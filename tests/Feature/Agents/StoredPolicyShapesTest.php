<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\Agents\AccessType;
use App\Enums\Agents\ExecutionModeType;
use App\Values\AccessPolicy;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\HostAccess;
use App\Values\OperationGrant;
use App\Values\ProcessGrants;
use App\Values\ResourceRequest;
use App\Values\StopCondition;
use App\Values\StopConditions;
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

        $stored = $access->toArray();
        $read = AccessPolicy::from($stored);

        $this->assertSame(['read', 'execute'], $stored['paths'][0]['access']);
        $this->assertEquals($access, $read);
    }

    public function test_stop_conditions_read_back_as_they_were_stored(): void
    {
        $conditions = new StopConditions([StopCondition::cleanWorktree()], 40);

        $stored = $conditions->toArray();
        $read = StopConditions::from($stored);

        $this->assertSame(10, $stored['conditions'][0]['timeout_seconds']);
        $this->assertEquals($conditions, $read);
    }

    public function test_an_execution_policy_reads_back_as_it_was_stored(): void
    {
        $execution = new ExecutionPolicy(
            ExecutionModeType::ProtectedHost,
            null,
            '/workspace',
            ExecutionBudgets::defaults(),
            ['egress'],
        );

        $stored = $execution->toArray();
        $read = ExecutionPolicy::from($stored);

        $this->assertSame('protected_host', $stored['mode']);
        $this->assertSame(2, $stored['budgets']['cpu_cores']);
        $this->assertEquals($execution, $read);
    }
}
