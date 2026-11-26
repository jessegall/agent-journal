<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Models\Projects\Host;
use App\Projects\Enums\ArrangementType;

/**
 * Enrols a local host of this protocol that declared every driver and driver type on the protected host, so a main start
 * has a host to run on.
 */
trait ServesEveryCombination
{
    private function serveEveryCombination(): Host
    {
        $host = Host::create('local host', 'secret', [base_path()], ArrangementType::Local);

        return $host;
    }
}
