<?php

declare(strict_types=1);

namespace App\Projects\Commands\RevokeHost;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;

/**
 * Revokes each unrevoked host of the installation name at one time, through the host's own transition.
 */
final readonly class RevokeHostHandler implements CommandHandler
{
    public function handle(RevokeHostCommand $command): int
    {
        $hosts = Host::findLockedUnrevokedNamed($command->installationName);
        $now = CarbonImmutable::now();

        foreach ($hosts as $host) {
            $host->revokeAt($now);
        }

        return count($hosts);
    }
}
