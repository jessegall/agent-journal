<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Sharing\ShareGatewayProvider;
use App\Contracts\Sharing\SharePolicy;
use App\Contracts\Sharing\ShareRecordContributor;
use App\Contracts\Sharing\ShareStatusResolver;
use App\Enums\AccessType;
use App\Policies\ShareRequestPolicy;
use App\Policies\SharingPolicy;
use App\Support\Gateways\Ngrok\NgrokGateway;
use App\Support\Gateways\Tunler\TunlerGateway;
use App\Support\LiveShareStatus;
use App\Support\OwnerSharePolicy;
use App\Support\ShareGatewayRegistry;
use App\Support\ShareRecordRegistry;
use App\Values\PolicyDefinition;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of shareable record types and one of share gateways for the application's life, filled at
 * boot from Core's own gateways and the domains that declare ShareRecordContributor or ShareGatewayProvider, and binds
 * the owner's share policy. The record types' relations are checked once everything
 * booted, so a wrong one stops the boot.
 */
final class SharingServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(ShareStatusResolver::class, LiveShareStatus::class);
        $this->app->singleton(ShareRecordRegistry::class);
        $this->app->singleton(ShareGatewayRegistry::class);
        $this->app->bind(SharePolicy::class, OwnerSharePolicy::class);
    }

    public function boot(
        ShareGatewayRegistry $gateways,
        PolicyCatalogue $policies,
    ): void {
        $policies->register('Core', new PolicyDefinition(
            SharingPolicy::class,
            [
                AccessType::Create,
                AccessType::Edit,
            ],
        ));

        $policies->register('Core', new PolicyDefinition(
            ShareRequestPolicy::class,
            [AccessType::Create],
        ));

        $gateways->register(TunlerGateway::KEY, TunlerGateway::class);
        $gateways->register(NgrokGateway::KEY, NgrokGateway::class);

        $this->app->booted(fn () => $this->app->make(ShareRecordRegistry::class)->checkRelations());
        $this->loadCoreRoutes('sharing/sharing.php');
    }
}
