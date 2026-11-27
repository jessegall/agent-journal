<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReserveHostDriverImages;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostNotContained;
use App\Hosts\Contracts\HostDriverImages;
use App\Models\Projects\Host;

final readonly class ReserveHostDriverImagesHandler implements CommandHandler
{
    public function __construct(private HostDriverImages $images) {}

    /**
     * How many rows the host keeps, one per distinct recipe.
     *
     * @throws HostNotContained
     */
    public function handle(ReserveHostDriverImagesCommand $command): int
    {
        $host = Host::findLocked($command->hostId);

        if (! $host->arrangement->isContained()) {
            throw HostNotContained::forImages($host->id);
        }

        return count($this->images->reserveAll($host));
    }
}
