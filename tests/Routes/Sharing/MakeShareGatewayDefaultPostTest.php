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
 * The owner makes a share gateway configuration the default.
 */
#[TestsRoute('POST', 'sharing.make-share-gateway-default')]
final class MakeShareGatewayDefaultPostTest extends GuardedRouteEntryTestCase
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
            ->parameters(['configuration' => $configuration->id])
            ->headers(['Idempotency-Key' => 'gateway-1'])
            ->reply(ConfigureShareGatewayCommand::class, $configuration->to_configuration)
            ->expects(ConfigureShareGatewayCommand::class, ['makesDefault' => true, 'requestKey' => 'gateway-1']);
    }
}
