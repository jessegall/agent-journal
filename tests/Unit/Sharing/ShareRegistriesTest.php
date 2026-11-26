<?php

declare(strict_types=1);

namespace Tests\Unit\Sharing;

use App\Records\Enums\ShareRelationType;
use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Values\ShareRecordDefinition;
use App\Sharing\Exceptions\ShareGatewayInvalid;
use App\Sharing\Exceptions\ShareRecordInvalid;
use App\Sharing\Exceptions\UnknownShareGateway;
use App\Sharing\Exceptions\UnknownShareRecordType;
use App\Sharing\Exceptions\UnknownShareRelation;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Sharing\Support\ShareRecordRegistry;
use Tests\Fixtures\Domains\Flyers\FlyersDomain;
use Tests\Fixtures\Domains\Leaflets\LeafletsDomain;
use Tests\Fixtures\Domains\Pamphlets\Pamphlet;
use Tests\Fixtures\Domains\Pamphlets\PamphletsDomain;
use Tests\Fixtures\Domains\Pamphlets\PamphletShareProvider;
use Tests\Fixtures\Domains\Pamphlets\PressGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\Sharing\SharingTestCase;

/**
 * The share registries: domains register shareable record types and gateways when they boot, each alias and key once
 * with a class of the right interface; relations are read and checked once, and an unknown alias, relation or gateway
 * is a named refusal.
 */
final class ShareRegistriesTest extends SharingTestCase
{
    use RegistersShareDomains;

    public function test_a_booted_domain_resolves_its_alias_to_model_provider_and_relation(): void
    {
        $this->registerShareDomain(PamphletsDomain::class);
        $records = $this->app->make(ShareRecordRegistry::class);
        $records->checkRelations();

        $this->assertSame(Pamphlet::class, $records->get('pamphlets.pamphlet')->modelClass);
        $this->assertInstanceOf(PamphletShareProvider::class, $records->provider('pamphlets.pamphlet'));
        $this->assertSame(ShareRelationType::Owned, $records->relation('pamphlets.pamphlet', 'notes')->type);
        $this->assertInstanceOf(PressGateway::class, $this->app->make(ShareGatewayRegistry::class)->get('press'));
    }

    public function test_a_second_domain_registering_the_same_alias_stops_its_boot(): void
    {
        $this->registerShareDomain(PamphletsDomain::class);

        $this->expectExceptionObject(ShareRecordInvalid::repeated('pamphlets.pamphlet'));

        $this->registerShareDomain(LeafletsDomain::class);
    }

    public function test_a_relation_needing_a_capability_no_record_advertises_is_kept_and_reaches_nothing(): void
    {
        $this->registerShareDomain(FlyersDomain::class);
        $records = $this->app->make(ShareRecordRegistry::class);

        $records->checkRelations();

        $this->assertTrue($records->has('flyers.flyer'));
    }

    public function test_a_model_or_provider_of_the_wrong_interface_and_a_bad_alias_are_refused(): void
    {
        $records = $this->app->make(ShareRecordRegistry::class);

        $this->assertThrows(
            fn () => $records->register(
                new ShareRecordDefinition(
                    'tests.thing',
                    PamphletShareProvider::class,
                    PamphletShareProvider::class,
                    [],
                ),
            ),
            ShareRecordInvalid::class,
            ShareRecordInvalid::notShareable('tests.thing', PamphletShareProvider::class)->getMessage(),
        );

        $this->assertThrows(
            fn () => $records->register(
                new ShareRecordDefinition('tests.thing', Pamphlet::class, Pamphlet::class, []),
            ),
            ShareRecordInvalid::class,
            ShareRecordInvalid::notAProvider('tests.thing', Pamphlet::class)->getMessage(),
        );

        $this->assertThrows(
            fn () => $records->register(
                new ShareRecordDefinition('Tests\\Thing', Pamphlet::class, PamphletShareProvider::class, []),
            ),
            InvalidRecordIdentity::class,
        );
    }

    public function test_an_unknown_alias_or_relation_is_a_named_refusal(): void
    {
        $this->registerShareDomain(PamphletsDomain::class);
        $records = $this->app->make(ShareRecordRegistry::class);
        $records->checkRelations();

        $this->assertFalse($records->has('Tests\\Fixtures\\Domains\\Pamphlets\\Pamphlet'));

        $this->assertThrows(
            fn () => $records->get('Tests\\Fixtures\\Domains\\Pamphlets\\Pamphlet'),
            UnknownShareRecordType::class,
        );

        $this->assertThrows(
            fn () => $records->relation('pamphlets.pamphlet', 'shareRelations'),
            UnknownShareRelation::class,
        );

        $this->assertThrows(fn () => $records->relation('pamphlets.note', 'notes'), UnknownShareRelation::class);
    }

    public function test_a_gateway_key_is_registered_once_with_a_gateway_class(): void
    {
        $gateways = $this->app->make(ShareGatewayRegistry::class);
        $gateways->register('press', PressGateway::class);

        $this->assertSame(['tunler', 'ngrok', 'press'], $gateways->keys());

        $this->assertThrows(
            fn () => $gateways->register('press', PressGateway::class),
            ShareGatewayInvalid::class,
            ShareGatewayInvalid::repeated('press')->getMessage(),
        );

        $this->assertThrows(
            fn () => $gateways->register('pamphlet', Pamphlet::class),
            ShareGatewayInvalid::class,
            ShareGatewayInvalid::notAGateway('pamphlet', Pamphlet::class)->getMessage(),
        );

        $this->assertThrows(fn () => $gateways->get('carrier-pigeon'), UnknownShareGateway::class);
    }
}
