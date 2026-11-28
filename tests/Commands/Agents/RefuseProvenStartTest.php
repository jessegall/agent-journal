<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\RefuseProvenStart\RefuseProvenStartCommand;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsCommand(RefuseProvenStartCommand::class)]
final class RefuseProvenStartTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_refused_start_ends_the_session_and_keeps_its_first_reason(): void
    {
        $this->journal->owner()->chooseActiveAccounts(config('journal.accounts.root'))
            ->showDriverArrangements()->idleAgent('Coder')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Coder', fn (TestAgent $agent) => $agent->openCodexRuntime('Mac', base_path()));
        $opened = $this->journal->openedRuntimeOf('Coder');
        $runtime = AgentRuntime::query()->withSession()->findOrFail($opened->runtimeId);
        $reason = 'The driver process refused to open.';

        $this->journal->asSystem(new RefuseProvenStartCommand($runtime->id, $reason));
        $this->journal->asSystem(new RefuseProvenStartCommand($runtime->id, 'A later refusal.'));

        $start = SessionProcess::findLatestOfSession($runtime->agent_session_id);
        $this->assertNotNull($start);
        $this->assertSame($reason, $start->refusal);
        $this->assertTrue($runtime->session->refresh()->hasEnded());
    }
}
