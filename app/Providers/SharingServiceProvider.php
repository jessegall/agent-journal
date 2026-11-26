<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Contracts\SharePolicy;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Concerns\LoadsCoreRoutes;
use App\Policies\ShareRequestPolicy;
use App\Policies\SharingPolicy;
use App\Sharing\Contracts\ShareGatewayProvider;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Sharing\Support\Gateways\NgrokGateway;
use App\Sharing\Support\Gateways\TunlerGateway;
use App\Sharing\Support\LiveShareStatus;
use App\Sharing\Support\OwnerSharePolicy;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use App\Support\DomainRegistry;
use App\Support\FolderClasses;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of share gateways for the application's life, filled at boot from the journal's own gateways and
 * the domains that declare ShareGatewayProvider, binds the live share status and the owner's share policy, registers
 * the sharing policies, and loads the share routes and console commands.
 */
final class SharingServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(ShareStatusResolver::class, LiveShareStatus::class);
        $this->app->singleton(ShareGatewayRegistry::class);
        $this->app->bind(SharePolicy::class, OwnerSharePolicy::class);
        $this->app->singleton(ShareRecordRegistry::class);
    }

    public function boot(ShareGatewayRegistry $gateways, DomainRegistry $domains, PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyDefinition(SharingPolicy::class, [AccessType::Create, AccessType::Edit]));
        $policies->register('Core', new PolicyDefinition(ShareRequestPolicy::class, [AccessType::Create]));
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

        $this->commands(FolderClasses::in(dirname(__DIR__).'/Console/Commands/Sharing', Command::class));
        $this->loadCoreRoutes('sharing/sharing.php');
    }
}
