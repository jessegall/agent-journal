<?php

declare(strict_types=1);

namespace App\Connections\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyDefinition;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;
use Illuminate\Support\ServiceProvider;

/**
 * Connects projects on other machines to this journal: the owner's install lines, the URL each one opens and the
 * script it serves.
 */
final class ConnectionsServiceProvider extends ServiceProvider
{
    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyDefinition(
            ConnectionsPolicy::class,
            [AccessType::Create, AccessType::Edit],
        ));
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/connections.php');
    }
}
