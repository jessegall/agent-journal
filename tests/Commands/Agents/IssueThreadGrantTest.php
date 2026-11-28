<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\IssueThreadGrant\IssueThreadGrantCommand;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsCommand(IssueThreadGrantCommand::class)]
final class IssueThreadGrantTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_thread_gets_a_distinct_grant_for_the_same_profile(): void
    {
        $this->journal->owner()->chooseActiveAccounts(config('journal.accounts.root'))
            ->showDriverArrangements()->idleAgent('Coder')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Coder', fn (TestAgent $agent) => $agent->openCodexRuntime('Mac', base_path()));
        $runtime = $this->journal->openedRuntimeOf('Coder');

        $first = $this->journal->asSystem(new IssueThreadGrantCommand($runtime->runtimeId));
        $next = $this->journal->asSystem(new IssueThreadGrantCommand($runtime->runtimeId));

        $this->assertNotEmpty($first->token);
        $this->assertNotEmpty($next->token);
        $this->assertNotSame($first->token, $next->token);
        $this->assertEquals($first->profile, $next->profile);
    }
}
