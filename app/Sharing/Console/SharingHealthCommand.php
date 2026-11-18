<?php

declare(strict_types=1);

namespace App\Sharing\Console;

use App\Sharing\Models\ShareInstallation;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;

/**
 * The share service's health check: healthy while the share-only listener answers on its port and a sharing
 * supervisor holds the gateways under a fresh run lease.
 */
final class SharingHealthCommand extends Command
{
    private const float CONNECT_SECONDS = 2.0;

    protected $signature = 'sharing:health';

    protected $description = 'Say whether the share-only listener answers and the sharing supervisor holds the gateways';

    public function handle(#[Config('sharing.listener.host')] string $host, #[Config('sharing.listener.port')] int $port): int
    {
        $listener = @fsockopen($host, $port, $errorCode, $errorText, self::CONNECT_SECONDS);

        if ($listener === false) {
            $this->error("The share-only listener does not answer on {$host}:{$port}.");

            return self::FAILURE;
        }

        fclose($listener);

        if (! ShareInstallation::hasLiveRun()) {
            $this->error('No sharing supervisor holds the gateways under a fresh run lease.');

            return self::FAILURE;
        }

        $this->info('Sharing is healthy.');

        return self::SUCCESS;
    }
}
