<?php

declare(strict_types=1);

namespace App\Records\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyRegistration;
use App\Links\Models\Link;
use App\Records\Console\LinkAddCommand;
use App\Records\Console\LinkRemoveCommand;
use App\Records\Enums\RecordLinkAbility;
use App\Records\Policies\RecordLinkPolicy;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the routes and the link:add and link:remove commands that read and link records of every domain.
 */
final class RecordsServiceProvider extends ServiceProvider
{
    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register(
            'Core',
            new PolicyRegistration(Link::class, RecordLinkPolicy::class, RecordLinkAbility::class),
        );
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/links.php');

        if ($this->app->runningInConsole()) {
            $this->commands([LinkAddCommand::class, LinkRemoveCommand::class]);
        }
    }
}
