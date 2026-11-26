<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Releases;

use App\Data\Connections\DriverInstallListData;
use App\Support\DriverInstallList;

/**
 * Serves the drivers a connected machine's installer seals beside the current release.
 */
final readonly class CurrentDriversController
{
    public function __invoke(DriverInstallList $list): DriverInstallListData
    {
        return $list->drivers();
    }
}
