<?php

declare(strict_types=1);

namespace Domain\Helpers\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Helpers\Contracts\HelperReader;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Readers\HelperRecords;
use Illuminate\Support\ServiceProvider;

/**
 * The service provider of the Helpers domain: it binds the receipt reader and names the job's link type.
 */
final class HelpersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(HelperReader::class, HelperRecords::class);
    }

    public function boot(LinkTypeRegistry $links): void
    {
        $links->register([HelperJob::LINK_TYPE => HelperJob::class]);
    }
}
