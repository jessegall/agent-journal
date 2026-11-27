<?php

declare(strict_types=1);

namespace App\Projects\Commands\EnrollHost;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\EnrolledHost;
use App\Models\Projects\Host;
use App\Projects\Exceptions\HostArrangementRefused;
use Illuminate\Support\Str;

final readonly class EnrollHostHandler implements CommandHandler
{
    public function handle(EnrollHostCommand $command): EnrolledHost
    {
        $secret = Str::random(64);
        $enrolled = Host::findLockedEnrolledNamed($command->installationName);

        if ($enrolled === null) {
            $host = Host::create($command->installationName, $secret, $command->startRoots, $command->arrangement);

            return new EnrolledHost($host->id, $secret);
        }

        // Another arrangement would change where every live process of the host runs.
        if ($enrolled->arrangement !== $command->arrangement) {
            throw HostArrangementRefused::unlikeEnrollment($command->arrangement, $enrolled->arrangement);
        }

        $enrolled->reenroll($secret, $command->startRoots);

        return new EnrolledHost($enrolled->id, $secret);
    }
}
