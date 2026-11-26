<?php

declare(strict_types=1);

namespace App\Projects\Commands\EnrollHost;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\EnrolledHost;
use App\Models\Projects\Host;
use Illuminate\Support\Str;

final readonly class EnrollHostHandler implements CommandHandler
{
    public function handle(EnrollHostCommand $command): EnrolledHost
    {
        $secret = Str::random(64);
        $host = Host::create($command->installationName, $secret, $command->startRoots, $command->arrangement);

        return new EnrolledHost($host->id, $secret);
    }
}
