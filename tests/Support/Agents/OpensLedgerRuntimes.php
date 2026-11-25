<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Commands\Terminals\RunKeyScript\RunKeyScriptCommand;
use App\Contracts\Bus\Command;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
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
     * A new agent's runtime opened by the owner on a new host in the project folder.
     *
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(string|null $firstMessage = null, string $build = '2.1.323'): array
    {
        $number = ++$this->openedRuntimeCount;
        $this->journal->idleAgent("Driven agent {$number}")->enrollHost("Test host {$number}", [self::FOLDER]);
        $opened = $this->journal->openRuntimeOn(
            "Driven agent {$number}",
            "Test host {$number}",
            self::FOLDER,
            build: $build,
            firstMessage: $firstMessage,
        );

        return [$this->journal->hostCalled("Test host {$number}"), $opened];
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
