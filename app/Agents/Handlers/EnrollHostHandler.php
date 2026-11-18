<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\EnrollHost;
use App\Agents\Models\Host;
use App\Agents\Support\EnrolledHost;
use App\Contracts\CommandHandler;
use Illuminate\Support\Str;

final readonly class EnrollHostHandler implements CommandHandler
{
    public function handle(EnrollHost $command): EnrolledHost
    {
        $secret = Str::random(64);
        $host = Host::query()->create([
            'installation_name' => $command->installationName,
            'credential_hash' => Host::hashOf($secret),
            'launch_roots' => $command->launchRoots,
        ]);

        return new EnrolledHost($host->id, $secret);
    }
}
