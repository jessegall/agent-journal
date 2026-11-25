<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Fixtures;

use Carbon\CarbonImmutable;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;

/**
 * Shares granted through the journal belong to its owner, name the root and configuration version they were given,
 * end when they were told to, and carry a token of their own.
 */
final class ShareFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_grant_follows_its_root_owner_configuration_and_end(): void
    {
        $this->journal->owner()->useServerClockAt(CarbonImmutable::parse('2026-11-25 12:00:00'));
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $root = TestActors::record('binders.binder', 1);

        $shares = $this->journal->fixtures(ShareFixtures::class)->grantForADay('Binder', $root, $configuration);

        $shares->assertGrant(
            'Binder',
            root: $root,
            owner: 'Owner',
            expiresAt: CarbonImmutable::parse('2026-11-26 12:00:00'),
            configurationVersion: $configuration->configuration_version,
        );
    }

    public function test_every_grant_has_a_token_of_its_own(): void
    {
        $this->journal->owner();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        $shares = $this->journal->fixtures(ShareFixtures::class)
            ->grantForADay('First', TestActors::record('binders.binder', 1), $configuration)
            ->grantForADay('Second', TestActors::record('binders.binder', 2), $configuration);

        $this->assertNotSame($shares->shareCalled('First')->token_digest, $shares->shareCalled('Second')->token_digest);
    }
}
