<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Models\Sharing\ShareGatewayConfiguration;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The journal grants shares that belong to its owner, name the root and configuration version they were given,
 * end when they were told to, and carry a token of their own.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalSharesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_grant_follows_its_root_owner_configuration_and_end(): void
    {
        $this->journal->owner()->travelTo(CarbonImmutable::parse('2026-11-25 12:00:00'));
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $root = TestActors::record('binders.binder', 1);

        $this->journal->shareForADay('Binder', $root, $configuration)->assertShare(
            'Binder',
            root: $root,
            owner: 'Owner',
            expiresAt: CarbonImmutable::parse('2026-11-26 12:00:00'),
            configurationVersion: $configuration->configuration_version,
        );
    }

    public function test_an_activated_grant_is_readable_now(): void
    {
        $this->journal->owner();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        $this->journal
            ->shareForADay('Binder', TestActors::record('binders.binder', 1), $configuration)
            ->activateShare('Binder');

        $this->assertTrue($this->journal->shareCalled('Binder')->isReadableNow());
    }

    public function test_every_grant_has_a_token_of_its_own(): void
    {
        $this->journal->owner();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        $this->journal
            ->shareForADay('First', TestActors::record('binders.binder', 1), $configuration)
            ->shareForADay('Second', TestActors::record('binders.binder', 2), $configuration);

        $this->assertNotSame(
            $this->journal->shareCalled('First')->token_digest,
            $this->journal->shareCalled('Second')->token_digest,
        );
    }

    public function test_a_grant_until_a_time_ends_at_that_time(): void
    {
        $this->journal->owner();
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $root = TestActors::record('binders.binder', 1);
        $end = CarbonImmutable::parse('2026-12-01 09:30:00');

        $this->journal
            ->shareUntil('Binder', $root, $configuration, $end)
            ->assertShare(
                'Binder',
                root: $root,
                owner: 'Owner',
                expiresAt: $end,
                configurationVersion: $configuration->configuration_version,
            );
    }
}
