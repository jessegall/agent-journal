<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Values\RuntimeIntent;
use App\Bus\Contracts\Command;
use App\Models\Agents\AgentRuntime;
use App\Sessions\AgentRuntimes;
use App\Sessions\StartSessions;
use App\Support\ActorReference;
use App\Terminals\Commands\OpenTerminalView\OpenTerminalViewCommand;
use App\Terminals\Commands\RenewTerminalView\RenewTerminalViewCommand;
use App\Terminals\Data\TerminalControlData;
use App\Terminals\Data\TerminalInterestData;
use App\Terminals\TerminalControls;
use App\Terminals\TerminalViewCloser;
use App\Time\Contracts\ServerClock;
use Tests\Fixtures\Agents\TestSelections;

/**
 * A started agent whose runtime runs on a host under the driver asked for, and commands run as the journal's owner,
 * for the terminal view tests.
 */
trait OpensTerminalRuntimes
{
    private int $watchedAgentCount = 0;

    /**
     * A new journal agent started in a session of its own, with a runtime of this driver open on the host, in the
     * project folder.
     */
    private function runtimeOn(string $hostId, DriverType $driver = DriverType::Terminal): AgentRuntime
    {
        $name = 'Watched agent '.++$this->watchedAgentCount;
        $started = $this->app->make(StartSessions::class)->start(
            $this->journal->idleAgent($name)->agentCalled($name),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
        $intent = new RuntimeIntent($hostId, base_path(), 'claude-code', '1.0.0', 'default', $driver, null, null, null);
        [$runtime] = $this->app->make(AgentRuntimes::class)->open($started->session, $intent, 'start-token');
        $runtime->load('session');

        return $runtime;
    }

    /**
     * Runs the command as the journal's owner and answers what the browser is answered: a view's read interest after
     * an open or renewal, the owner's control of the grant after a control command, and nothing after a close.
     */
    private function asOwner(Command $command): TerminalInterestData|TerminalControlData|null
    {
        $rowId = $this->journal->asOwner($command);

        return match (true) {
            $command instanceof OpenTerminalViewCommand, $command instanceof RenewTerminalViewCommand => $this->app
                ->make(TerminalViewCloser::class)
                ->answerFor($this->owner(), $rowId, $this->app->make(ServerClock::class)->now()),
            is_string($rowId) => $this->app
                ->make(TerminalControls::class)
                ->answerFor($this->owner(), $rowId, $this->app->make(ServerClock::class)->now()),
            default => null,
        };
    }

    private function owner(): ActorReference
    {
        return $this->journal->actorCalled('Owner');
    }
}
