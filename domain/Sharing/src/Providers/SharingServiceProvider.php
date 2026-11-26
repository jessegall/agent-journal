<?php

declare(strict_types=1);

namespace Domain\Sharing\Providers;

use App\Access\Contracts\SharePolicy;
use App\Support\DomainRegistry;
use App\Support\FolderClasses;
use Domain\Sharing\Contracts\ShareGatewayProvider;
use Domain\Sharing\Contracts\ShareStatusResolver;
use Domain\Sharing\Support\Gateways\NgrokGateway;
use Domain\Sharing\Support\Gateways\TunlerGateway;
use Domain\Sharing\Support\LiveShareStatus;
use Domain\Sharing\Support\OwnerSharePolicy;
use Domain\Sharing\Support\ShareGatewayRegistry;
use Domain\Sharing\Support\ShareRecordRegistry;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of share gateways for the application's life, filled at boot from the journal's own gateways and
 * the domains that declare ShareGatewayProvider, binds the live share status and the owner's share policy, and loads
 * the share routes and console commands.
 */
final class SharingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ShareStatusResolver::class, LiveShareStatus::class);
        $this->app->singleton(ShareGatewayRegistry::class);
        $this->app->bind(SharePolicy::class, OwnerSharePolicy::class);
        $this->app->singleton(ShareRecordRegistry::class);
    }

    public function boot(ShareGatewayRegistry $gateways, DomainRegistry $domains): void
    {
        $gateways->register(TunlerGateway::KEY, TunlerGateway::class);
        $gateways->register(NgrokGateway::KEY, NgrokGateway::class);

        foreach ($domains->all() as $entry) {
            $offered = $entry->provided(ShareGatewayProvider::class)
                ->map(fn (ShareGatewayProvider $domain) => $domain->shareGateways())
                ->getOrElse([]);

            foreach ($offered as $key => $gatewayClass) {
                $gateways->register($key, $gatewayClass);
            }
        }

        // Every domain booted first, so the morph map names the link types the share records give.
        $this->app->booted(function () use ($domains): void {
            $records = $this->app->make(ShareRecordRegistry::class);

            foreach ($domains->all() as $entry) {
                foreach ($entry->shareRecords() as $registration) {
                    $records->register($registration);
                }
            }

            $records->checkRelations();
        });

        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands', Command::class));
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/sharing.php');
    }
}
