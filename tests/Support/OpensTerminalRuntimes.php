<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Actions\AgentRuntimes;
use App\Agents\Actions\StartSessions;
use App\Agents\Enums\DriverVariant;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Values\RuntimeIntent;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
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
        $intent = new RuntimeIntent($hostId, base_path(), 'claude', '1.0.0', 'default', $driver, null, null, null);
        [$runtime] = $this->app->make(AgentRuntimes::class)->open($started->session, $intent, 'start-token');
        $runtime->load('session');

        return $runtime;
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function owner(): ActorIdentity
    {
        return ActorIdentity::of(ActorContext::forUser('owner'));
    }
}
