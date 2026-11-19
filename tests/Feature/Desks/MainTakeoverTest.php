<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Communication\Contracts\MemberInboxes;
use App\Desks\Commands\InstallDesks;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\BuiltInDesks;
use Tests\Support\MessagingTestCase;

/**
 * A main start seats its agent at main: a vacant seat is taken, the same agent restarting keeps it, and a different
 * agent takes it over, which fences every runtime of the agent that held it.
 */
final class MainTakeoverTest extends MessagingTestCase
{
    public function test_a_second_agent_takes_main_over_and_fences_the_first(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());

        $this->takeOver($this->builder);
        $this->takeOver($this->builder);

        $this->assertSame([true, false], [$this->seatedAtMain($this->builder), $this->seatedAtMain($this->reviewer)]);
        $this->assertTrue($this->agentOf($this->builder)->isCurrentRuntime($this->builder));

        $this->takeOver($this->reviewer);

        $this->assertSame([false, true], [$this->seatedAtMain($this->builder), $this->seatedAtMain($this->reviewer)]);
        $this->assertFalse($this->agentOf($this->builder)->isCurrentRuntime($this->builder));
        $this->assertTrue($this->agentOf($this->builder)->currentRuntime()->isEmpty());
        $this->assertTrue($this->agentOf($this->reviewer)->isCurrentRuntime($this->reviewer));
    }

    private function takeOver(AgentSession $session): void
    {
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainSeatTakeover::class)->takeOver($this->agentOf($session)),
        );
    }

    private function seatedAtMain(AgentSession $session): bool
    {
        $mainInboxId = DeskRecord::query()->named(BuiltInDesks::MAIN)->sole()->inboxId();
        $seated = $this->app->make(MemberInboxes::class)->inboxIdsOf($this->actorOf($session));
        $inboxIds = $seated->pluck('inbox_id')->all();

        return in_array($mainInboxId, $inboxIds, true);
    }

    private function agentOf(AgentSession $session): Agent
    {
        return Agent::query()->findOrFail($session->agent_id);
    }
}
