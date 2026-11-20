<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Agents\Commands\RunKeyScript;
use App\Agents\Models\AgentSession;
use App\Agents\Values\ScriptParameter;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner runs one registered maintenance key script, such as ChangeModel, on an agent's running terminal, under a
 * request key, and prints the request it appended.
 */
final class RunKeyScriptCommand extends Command
{
    protected $signature = 'agents:key-script {agent} {script} {--param=*} {--request-key=}';

    protected $description = 'Run a registered maintenance key script, such as ChangeModel, on an agent terminal';

    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $requestKey = $this->option('request-key');
        $key = $owner->useRequestKey($requestKey === null ? null : (string) $requestKey);
        $agentId = (string) $this->argument('agent');
        $session = AgentSession::query()->runningFor($agentId)->latest()->firstOrFail();
        $script = (string) $this->argument('script');
        $receipt = $commands->run(new RunKeyScript($agentId, $session->id, $key, $script, $this->parameters()));

        $this->line("Key script {$script} is request {$receipt->requestId} for agent {$agentId}.");

        return self::SUCCESS;
    }

    /**
     * The --param options, each written as name=value.
     *
     * @return list<ScriptParameter>
     */
    private function parameters(): array
    {
        return array_values(array_map(function (mixed $pair) {
            [$name, $parameterText] = array_pad(explode('=', (string) $pair, 2), 2, '');

            return new ScriptParameter($name, $parameterText);
        }, (array) $this->option('param')));
    }
}
