<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\JournalCommands;
use App\Support\MainInboxTakeover;
use Tests\Support\MessagingTestCase;

/**
 * A main start seats its agent at main: a vacant seat is taken, the same agent restarting keeps it, and a different
 * agent takes it over, which fences every runtime of the agent that held it.
 */
final class MainTakeoverTest extends MessagingTestCase
{
    public function test_a_second_agent_takes_main_over_and_fences_the_first(): void
    {
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());

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
            fn () => $this->app->make(MainInboxTakeover::class)->takeOver($this->agentOf($session)),
        );
    }

    private function isSeatedAtMain(AgentSession $session): bool
    {
        return InboxMember::findActive(Inbox::main()->id, $this->actorOf($session)) !== null;
    }

    private function agentOf(AgentSession $session): Agent
    {
        return Agent::query()->findOrFail($session->agent_id);
    }
}
