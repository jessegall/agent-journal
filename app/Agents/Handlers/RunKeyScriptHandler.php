<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Commands\RunKeyScript;
use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\DriverOperation;
use App\Agents\Exceptions\KeyScriptRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\DriverRequests;
use App\Agents\Values\DriverRequestPayload;
use App\Agents\Values\ScriptParameter;
use App\Contracts\CommandHandler;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Validation\Factory as ValidatorFactory;

/**
 * Appends a key script request behind the runtime's earlier requests, once its name is registered and its
 * parameters are exactly the ones the script takes, each fitting its rule.
 */
final readonly class RunKeyScriptHandler implements CommandHandler
{
    /**
     * @param  array<string, array{version: int, parameters: array<string, string>}>  $scripts
     */
    public function __construct(
        private CurrentAuthorizer $administration,
        private DriverRequests $requests,
        private ValidatorFactory $validators,
        #[Config('agents.key_scripts')] private array $scripts,
    ) {}

    /**
     * @throws KeyScriptRefused
     */
    public function handle(RunKeyScript $command): DriverReceipt
    {
        $this->administration->authorize(AgentPolicy::class, AgentRuntime::class, AgentAbility::RunKeyScript);
        $script = $this->scripts[$command->script] ?? throw KeyScriptRefused::unknown($command->script);
        $parameters = ScriptParameter::byName($command->parameters);
        $extra = array_diff(array_keys($parameters), array_keys($script['parameters']));
        $validator = $this->validators->make($parameters, $script['parameters']);

        if ($extra !== [] || $validator->fails()) {
            $unknown = array_map(fn (string $name) => "{$name} is not a parameter", array_values($extra));

            $problems = array_values([...$unknown, ...$validator->errors()->all()]);

            throw KeyScriptRefused::parameters($command->script, $problems);
        }

        $payload = DriverRequestPayload::keyScript($command->script, $script['version'], $parameters);

        $request = $this->requests->append(
            $command->target(),
            DriverOperation::KeyScript,
            $command->idempotencyKey,
            $payload,
        );

        return $request->receipt();
    }
}
