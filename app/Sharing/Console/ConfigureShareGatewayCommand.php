<?php

declare(strict_types=1);

namespace App\Sharing\Console;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Gateways\Support\GatewaySecrets;
use Illuminate\Console\Command;

/**
 * The owner configures a gateway from the command line: each secret named with --secret is asked for at a hidden
 * prompt and kept in the credential store before the command runs, so its bytes never enter an argument, a command,
 * a receipt or a log.
 */
final class ConfigureShareGatewayCommand extends Command
{
    protected $signature = 'share:gateway {gateway : The gateway key, such as tunler or ngrok} {--program-version= : The pinned program version} {--host= : The provider host} {--origin= : The fixed public origin, https://...} {--port=8100 : The listener port the gateway forwards to} {--secret=* : The name of a secret to enter} {--default : Make it the default once it is ready} {--request-key= : Send again under the key a failed attempt printed}';

    protected $description = 'Configure a share gateway; secrets are asked for at a hidden prompt';

    public function handle(ConsoleOwner $owner, GatewaySecrets $secrets, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $references = array_values(array_map(strval(...), (array) $this->option('secret')));

        foreach ($references as $reference) {
            $secrets->store($reference, (string) $this->secret("Enter the secret {$reference}"));
        }

        $key = $owner->useRequestKey(
            $this->option('request-key') === null ? null : (string) $this->option('request-key'),
        );
        $configuration = $commands->run(new ConfigureShareGateway(
            (string) $this->argument('gateway'),
            (string) $this->option('program-version'),
            (string) $this->option('host'),
            (string) $this->option('origin'),
            (int) $this->option('port'),
            $references,
            (bool) $this->option('default'),
            $key,
        ));

        $this->line(
            "The {$configuration->settings->gatewayKey} gateway is at version {$configuration->configurationVersion}.",
        );

        return self::SUCCESS;
    }
}
