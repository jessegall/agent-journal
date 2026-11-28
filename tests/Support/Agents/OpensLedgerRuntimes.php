<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Bus\Contracts\Command;
use App\Hosts\EnrolledHost;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Sessions\OpenedRuntime;
use App\Terminals\Commands\RunKeyScript\RunKeyScriptCommand;
use App\Values\ScriptParameter;
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

    private int $openedRuntimeCount = 0;

    /**
     * Every runtime starts through the real start path, which runs with the account chosen for its driver, opened by
     * the journal's owner.
     */
    protected function setUpOpensLedgerRuntimes(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner();
    }

    /**
     * A new agent's runtime opened by the owner on a new host in the project folder, its driver's arrangement shown.
     *
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(
        string|null $firstMessage = null,
        string $build = '2.1.332',
        string $driver = 'claude-code',
        DriverType $driverType = DriverType::Terminal,
    ): array {
        $number = ++$this->openedRuntimeCount;
        $this->journal->showDriverArrangements()->idleAgent("Driven agent {$number}")->enrollHost("Test host {$number}", [self::FOLDER]);
        $this->journal->withAgent("Driven agent {$number}", fn (TestAgent $agent) => $agent->openRuntime(
            "Test host {$number}",
            self::FOLDER,
            driver: $driver,
            build: $build,
            driverType: $driverType,
            firstMessage: $firstMessage,
        ));
        $opened = $this->journal->openedRuntimeOf("Driven agent {$number}");

        return [
            $this->journal->hostCalled("Test host {$number}"),
            $opened,
        ];
    }

    /**
     * A runtime whose requests its host still claims itself: a Codex headless one, as the journal drives Claude Code.
     *
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openHostClaimedRuntime(string|null $firstMessage = null): array
    {
        return $this->openRuntime($firstMessage, driver: DefaultDrivers::CODEX, driverType: DriverType::Headless);
    }

    private function enrollHost(): EnrolledHost
    {
        $name = 'Enrolled host '.++$this->openedRuntimeCount;

        return $this->journal->enrollHost($name, [self::FOLDER])->hostCalled($name);
    }

    private function agent(): Agent
    {
        $name = 'Idle agent '.++$this->openedRuntimeCount;

        return $this->journal->idleAgent($name)->agentCalled($name);
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
        return new RunKeyScriptCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            (string) Str::ulid(),
            $script,
            ScriptParameter::listOf($parameters),
        );
    }

    /**
     * Runs a command as the journal's owner, as the web and the CLI do.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asOwner(Command $command): mixed
    {
        return $this->journal->asOwner($command);
    }
}
