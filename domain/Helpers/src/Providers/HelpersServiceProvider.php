<?php

declare(strict_types=1);

namespace Domain\Helpers\Providers;

use App\Autoload\Support\FolderClasses;
use App\Links\Support\LinkTypeRegistry;
use Domain\Helpers\Contracts\HelperReader;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Readers\HelperRecords;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * The service provider of the Helpers domain: it binds the receipt reader, loads the signed helper calls and their
 * console commands, and names the job's link type.
 */
final class HelpersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(HelperReader::class, HelperRecords::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agent.php');
        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        $links->register([HelperJob::LINK_TYPE => HelperJob::class]);
    }
}
