<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Desks\InstallDesks\InstallDesksCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Chat\MainSeatTakeover;
use App\Enums\CommandEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Desks\DeskRecord;
use App\Support\BuiltInDesks;
use App\Support\EntryDispatchers;
use App\Support\RegisteredInboxes;
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
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesksCommand());

        $this->takeOver($this->builder);
        $this->takeOver($this->builder);

        $this->assertSame([true, false], [$this->isSeatedAtMain($this->builder), $this->isSeatedAtMain($this->reviewer)]);
        $this->assertTrue($this->agentOf($this->builder)->isCurrentRuntime($this->builder));

        $this->takeOver($this->reviewer);

        $this->assertSame([false, true], [$this->isSeatedAtMain($this->builder), $this->isSeatedAtMain($this->reviewer)]);
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

    private function isSeatedAtMain(AgentSession $session): bool
    {
        $mainInboxId = DeskRecord::query()->named(BuiltInDesks::MAIN)->sole()->inboxId();
        $seated = $this->app->make(RegisteredInboxes::class)->inboxIdsOf($this->actorOf($session));
        $inboxIds = $seated->pluck('inbox_id')->all();

        return in_array($mainInboxId, $inboxIds, true);
    }

    private function agentOf(AgentSession $session): Agent
    {
        return Agent::query()->findOrFail($session->agent_id);
    }
}
