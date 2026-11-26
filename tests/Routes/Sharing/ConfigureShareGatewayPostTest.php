<?php

declare(strict_types=1);

namespace Tests\Routes\Sharing;

use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use Domain\Documents\DocumentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Sharing\FakeShareGateway;

/**
 * The owner configures a share gateway.
 */
#[TestsRoute('POST', 'sharing.configure-share-gateway')]
final class ConfigureShareGatewayPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        return RouteCall::as(Caller::User)
            ->headers(['Idempotency-Key' => 'gateway-1'])
            ->payload([
                'gatewayKey' => 'fake',
                'executableVersion' => '1.0.0',
                'providerHost' => 'gateway.example.test',
                'publicOrigin' => 'https://share.example.test',
                'listenerPort' => 8443,
                'secrets' => [],
                'makeDefault' => true,
            ])
            ->reply(ConfigureShareGatewayCommand::class, $configuration->to_configuration)
            ->expects(ConfigureShareGatewayCommand::class, [
                'gatewayKey' => 'fake',
                'executableVersion' => '1.0.0',
                'providerHost' => 'gateway.example.test',
                'publicOrigin' => 'https://share.example.test',
                'listenerPort' => 8443,
                'secretReferences' => [],
                'makesDefault' => true,
                'requestKey' => 'gateway-1',
            ]);
    }
}
