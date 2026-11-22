<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\RunKeyScript\RunKeyScriptCommand as RunKeyScript;
use App\Contracts\Bus\CommandBus;
use App\Models\AgentSession;
use App\Support\ConsoleOwner;
use App\Values\ScriptParameter;
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
