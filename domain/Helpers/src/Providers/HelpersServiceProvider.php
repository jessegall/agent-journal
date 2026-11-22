<?php

declare(strict_types=1);

namespace Domain\Helpers\Providers;

use App\Contracts\SupervisorDispatch;
use App\Contracts\SystemEntryPolicies;
use App\Contracts\WorkRepair;
use App\Support\FolderClasses;
use App\Support\LinkTypeRegistry;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Support\HelperSupervisorDispatch;
use Domain\Helpers\Support\HelperWorkRepair;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * The service provider of the Helpers domain: it binds the supervisor dispatch and work repair, loads the signed
 * helper calls and their console commands, names the job's link type, and lets the journal change helper jobs under
 * its lifecycle entry.
 */
final class HelpersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(SupervisorDispatch::class, HelperSupervisorDispatch::class);
        $this->app->bind(WorkRepair::class, HelperWorkRepair::class);
    }

    public function boot(LinkTypeRegistry $links, SystemEntryPolicies $systemEntries): void
    {
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));
        $links->register([HelperJob::LINK_TYPE => HelperJob::class]);
        $systemEntries->allow(HelperLifecycleEntry::NAME, HelperPolicy::class);
    }
}
