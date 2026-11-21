<?php

declare(strict_types=1);

namespace App\Sharing\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyDefinition;
use App\Autoload\Support\FolderClasses;
use App\Numbers\Contracts\NumberedModelRegistration;
use App\Numbers\Support\NumberedModel;
use App\Operations\Enums\AccessType;
use App\Sharing\Contracts\ShareGatewayProvider;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Contracts\ShareRecordContributor;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Sharing\Gateways\Ngrok\NgrokGateway;
use App\Sharing\Gateways\Tunler\TunlerGateway;
use App\Sharing\Models\Share;
use App\Sharing\Policies\ShareRequestPolicy;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\LiveShareStatus;
use App\Sharing\Support\OwnerSharePolicy;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use Illuminate\Console\Command;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of shareable record types and one of share gateways for the application's life, filled at
 * boot from Core's own gateways and the domains that declare ShareRecordContributor or ShareGatewayProvider, and binds
 * the owner's share policy. The record types' relations are checked once everything
 * booted, so a wrong one stops the boot.
 */
final class SharingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ShareStatusResolver::class, LiveShareStatus::class);
        $this->app->singleton(ShareRecordRegistry::class);
        $this->app->singleton(ShareGatewayRegistry::class);
        $this->app->bind(SharePolicy::class, OwnerSharePolicy::class);
    }

    public function boot(
        ShareGatewayRegistry $gateways,
        NumberedModelRegistration $numbers,
        PolicyCatalogue $policies,
    ): void {
        $policies->register('Core', new PolicyDefinition(
            SharingPolicy::class,
            [AccessType::Create, AccessType::Edit],
            ownerOnly: [AccessType::Create, AccessType::Edit],
        ));
        $policies->register('Core', new PolicyDefinition(
            ShareRequestPolicy::class,
            [AccessType::Create],
        ));
        $numbers->register(NumberedModel::global(Share::class));
        $gateways->register(TunlerGateway::KEY, TunlerGateway::class);
        $gateways->register(NgrokGateway::KEY, NgrokGateway::class);

        $this->app->booted(fn () => $this->app->make(ShareRecordRegistry::class)->checkRelations());
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/sharing.php');

        if ($this->app->runningInConsole()) {
            $this->commands(FolderClasses::in(dirname(__DIR__).'/Console', Command::class));
        }
    }
}
