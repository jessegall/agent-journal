<?php

declare(strict_types=1);

namespace App\Sharing\Providers;

use App\Domains\Support\DomainRegistry;
use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\NumberedTypeRegistry;
use App\Sharing\Console\ConfigureShareGatewayCommand;
use App\Sharing\Console\RequestShareCommand;
use App\Sharing\Console\ShareCreateCommand;
use App\Sharing\Console\ShareListCommand;
use App\Sharing\Console\ShareRevokeCommand;
use App\Sharing\Console\ShareStatusCommand;
use App\Sharing\Console\ShareUrlCommand;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Gateways\Ngrok\NgrokGateway;
use App\Sharing\Gateways\Tunler\TunlerGateway;
use App\Sharing\Models\Share;
use App\Sharing\Support\OwnerSharePolicy;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use Illuminate\Support\ServiceProvider;

/**
 * Keeps one registry of shareable record types and one of share gateways for the application's life, filled at
 * boot from Core's own gateways and the domains that declare ProvidesShareRecords or ProvidesShareGateways, and binds
 * the owner's share policy. The record types' relations are checked once everything
 * booted, so a wrong one stops the boot.
 */
final class SharingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ShareRecordRegistry::class);
        $this->app->singleton(ShareGatewayRegistry::class);
        $this->app->bind(SharePolicy::class, OwnerSharePolicy::class);
    }

    public function boot(DomainRegistry $domains, ShareRecordRegistry $records, ShareGatewayRegistry $gateways, NumberedTypeRegistry $numbers): void
    {
        $numbers->register(NumberedModel::global(Share::class));
        $gateways->register(TunlerGateway::KEY, TunlerGateway::class);
        $gateways->register(NgrokGateway::KEY, NgrokGateway::class);

        foreach ($domains->all() as $entry) {
            if ($entry->domain instanceof ProvidesShareRecords) {
                $records->registerFrom($entry->domain);
            }

            if ($entry->domain instanceof ProvidesShareGateways) {
                $gateways->registerFrom($entry->domain);
            }
        }

        $this->app->booted(fn () => $this->app->make(ShareRecordRegistry::class)->checkRelations());
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/sharing.php');

        if ($this->app->runningInConsole()) {
            $this->commands([RequestShareCommand::class, ShareStatusCommand::class, ShareListCommand::class, ShareCreateCommand::class, ShareRevokeCommand::class, ShareUrlCommand::class, ConfigureShareGatewayCommand::class]);
        }
    }
}
