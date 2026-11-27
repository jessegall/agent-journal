<?php

declare(strict_types=1);

namespace App\Terminals\Commands\RunKeyScript;

use App\Agents\DriverRequests;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Bus\Contracts\CommandHandler;
use App\Terminals\Exceptions\KeyScriptRefused;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;
use App\Values\ScriptParameter;
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
        private DriverRequests $requests,
        private ValidatorFactory $validators,
        #[Config('journal.agents.key_scripts')]
        private array $scripts,
    ) {}

    /**
     * @throws KeyScriptRefused
     */
    public function handle(RunKeyScriptCommand $command): DriverReceipt
    {
        $script = $this->scripts[$command->script] ?? throw KeyScriptRefused::unknown($command->script);
        $parameters = ScriptParameter::byName($command->parameters);
        $extra = array_diff(array_keys($parameters), array_keys($script['parameters']));
        $validator = $this->validators->make($parameters, $script['parameters']);

        if ($extra !== [] || $validator->fails()) {
            $unknown = array_map(fn (string $name) => "{$name} is not a parameter", array_values($extra));

            $problems = array_values([...$unknown, ...$validator->errors()->all()]);

            throw KeyScriptRefused::parameters($command->script, $problems);
        }

        $driverEnvelope = DriverRequestPayload::keyScript($command->script, $script['version'], $parameters);

        $request = $this->requests->append(
            $command->target(),
            DriverOperation::KeyScript,
            $command->idempotencyKey,
            $driverEnvelope,
        );

        return $request->receipt;
    }
}
