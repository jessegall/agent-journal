<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\RenewTerminalView\RenewTerminalViewCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Time\ServerClock;
use App\Data\TerminalControlData;
use App\Data\TerminalInterestData;
use App\Enums\DriverVariant;
use App\Models\Agent;
use App\Models\AgentRuntime;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AgentRuntimes;
use App\Support\StartSessions;
use App\Support\TerminalControls;
use App\Support\TerminalViews;
use App\Values\OwnerAuthority;
use App\Values\RuntimeIntent;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;

/**
 * A started agent whose runtime runs on a host under the driver asked for, and commands run as the journal's owner,
 * for the terminal view tests.
 */
trait OpensTerminalRuntimes
{
    private function runtimeOn(string $hostId, DriverVariant $driver = DriverVariant::Terminal): AgentRuntime
    {
        $agent = Agent::create('Watched agent '.Str::random(6), 'main-agent');
        $started = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
        $intent = new RuntimeIntent($hostId, base_path(), 'claude-code', '1.0.0', 'default', $driver, null, null, null);
        [$runtime] = $this->app->make(AgentRuntimes::class)->open($started->session, $intent, 'start-token');
        $runtime->load('session');

        return $runtime;
    }

    /**
     * Runs the command as the owner and answers what the browser is answered: a view's read interest after an open or
     * renewal, the owner's control of the grant after a control command, and nothing after a close.
     */
    private function asOwner(Command $command): TerminalInterestData|TerminalControlData|null
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $rowId = $this->app->make(CommandBus::class)->run($command);

        return match (true) {
            $command instanceof OpenTerminalViewCommand, $command instanceof RenewTerminalViewCommand => $this->app
                ->make(TerminalViews::class)
                ->answerFor($this->owner(), $rowId, $this->app->make(ServerClock::class)->now()),
            is_string($rowId) => $this->app
                ->make(TerminalControls::class)
                ->answerFor($this->owner(), $rowId, $this->app->make(ServerClock::class)->now()),
            default => null,
        };
    }

    private function owner(): ActorIdentity
    {
        return ActorIdentity::of(ActorContext::forUser('owner'));
    }
}
