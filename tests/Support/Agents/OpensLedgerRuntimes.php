<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\EnrollHost\EnrollHostCommand;
use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Commands\RunKeyScript\RunKeyScriptCommand;
use App\Agents\Enums\DriverVariant;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Values\ScriptParameter;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use Illuminate\Support\Str;
use Tests\Support\WithActiveAccount;

/**
 * Opens an agent's runtime on a newly enrolled host through the ledger's own commands, runs commands as the owner
 * of the journal, as the web and the CLI do, and makes the host's signed calls. The test class runs trusted commands
 * with asSystem.
 */
trait OpensLedgerRuntimes
{
    use WithActiveAccount;

    private const string FOLDER = '/work/project';

    /**
     * Every runtime starts through the real start path, which runs with the account chosen for its driver.
     */
    protected function setUpOpensLedgerRuntimes(): void
    {
        $this->chooseActiveAccounts();
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(string|null $firstMessage = null, string $build = '2.1.323'): array
    {
        $host = $this->enrollHost();
        $opened = $this->asOwner(
            new OpenAgentRuntimeCommand(
                $this->agent()->id,
                $host->hostId,
                self::FOLDER,
                'claude-code',
                $build,
                'claude',
                DriverVariant::Headless,
                'claude-opus-5-5',
                firstMessage: $firstMessage,
            ),
        );

        return [$host, $opened];
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
    }

    private function agent(): Agent
    {
        return Agent::create('Driven agent '.Str::random(6), 'main-agent');
    }

    private function agentIdOf(OpenedRuntime $opened): string
    {
        return AgentSession::query()->findOrFail($opened->sessionId)->agent_id;
    }

    /**
     * @param  array<string, string>  $parameters
     */
    private function keyScript(OpenedRuntime $opened, string $script, array $parameters): RunKeyScriptCommand
    {
        $key = (string) Str::ulid();

        return new RunKeyScriptCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            $key,
            $script,
            ScriptParameter::listOf($parameters),
        );
    }

    /**
     * Runs a command as the user who owns the journal, as the web and the CLI do.
     *
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
}
