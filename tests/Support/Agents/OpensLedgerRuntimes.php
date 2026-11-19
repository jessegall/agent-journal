<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\RunKeyScript;
use App\Agents\Enums\DriverType;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Values\ScriptParameter;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;

/**
 * Opens an agent's runtime on a newly enrolled host through the ledger's own commands, runs commands as the owner
 * of the journal, as the web and the CLI do, and makes the host's signed calls. The test class runs trusted commands
 * with asSystem.
 */
trait OpensLedgerRuntimes
{
    private const string FOLDER = '/work/project';

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(string|null $firstMessage = null, string $build = '2.1.323'): array
    {
        $host = $this->enrollHost();
        $opened = $this->asOwner(
            new OpenAgentRuntime(
                $this->agent()->id,
                $host->hostId,
                self::FOLDER,
                'claude-code',
                $build,
                'claude',
                DriverType::Process,
                'claude-opus-5-5',
                firstMessage: $firstMessage,
            ),
        );

        return [$host, $opened];
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHost('test host '.Str::random(6), [self::FOLDER]));
    }

    private function agent(): Agent
    {
        return Agent::named('Driven agent '.Str::random(6), 'main-agent');
    }

    private function agentIdOf(OpenedRuntime $opened): string
    {
        return AgentSession::query()->findOrFail($opened->sessionId)->agent_id;
    }

    /**
     * @param  array<string, string>  $parameters
     */
    private function keyScript(OpenedRuntime $opened, string $script, array $parameters): RunKeyScript
    {
        $key = (string) Str::ulid();

        return new RunKeyScript(
            $this->agentIdOf($opened),
            $opened->sessionId,
            $key,
            $script,
            ScriptParameter::listOf($parameters),
        );
    }

    /**
     * A call the host signs with its secret, as tools/journal-agent/client makes it.
     *
     * @param  array<string, mixed>|null  $body
     */
    private function hostCall(EnrolledHost $host, string $target, array|null $body = null): TestResponse
    {
        $content = $body === null ? '' : (string) json_encode($body);
        $callId = (string) Str::uuid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $signature = SignedCall::signatureFor($host->secret, 'POST', $target, $callId, $issuedAt, $content);

        return $this->call('POST', $target, server: [
            'HTTP_AUTHORIZATION' => "Bearer {$host->secret}",
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::ID_HEADER)) => $callId,
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::ISSUED_AT_HEADER)) => (string) $issuedAt,
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::SIGNATURE_HEADER)) => $signature,
        ], content: $content);
    }

    /**
     * Runs a command as the person who owns the journal, as the web and the CLI do.
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
