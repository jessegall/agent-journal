<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Documents\DocumentsDomain;
use Domain\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\SharingDomain;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner disables a share gateway configuration.
 */
#[TestsRoute('DELETE', 'sharing.disable-share-gateway')]
final class DisableShareGatewayDeleteTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        return RouteCall::as(Caller::User)
            ->parameters([
                'configuration' => $configuration->id,
            ])
            ->headers([
                'Idempotency-Key' => 'gateway-1',
            ])
            ->reply(DisableShareGatewayCommand::class, $configuration->to_configuration)
            ->expects(DisableShareGatewayCommand::class, [
                'configurationId' => $configuration->id,
                'requestKey' => 'gateway-1',
            ]);
    }
}
