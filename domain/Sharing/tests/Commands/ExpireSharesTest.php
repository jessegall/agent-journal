<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Enums\Accounts\CommandEntry;
use App\Support\RecordIdentity;
use Domain\Sharing\Commands\ExpireShares\ExpireSharesCommand;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Support\ShareExpiry;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;

/**
 * The sharing supervisor ends every share past its deadline as expired and counts them; a share still within its
 * deadline stays as it is.
 */
final class ExpireSharesTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TRUSTED_ENTRY = 'sharing supervisor';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_share_past_its_deadline_expires_and_one_within_it_stays(): void
    {
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $due = $this->grantForADay(TestActors::record('binders.binder', 1), $configuration);
        $this->travel(2)->days();
        $current = $this->grantForADay(TestActors::record('binders.binder', 2), $configuration);

        $expiry = $this->journal->runAsJournal(
            CommandEntry::ShareGateway,
            self::TRUSTED_ENTRY,
            new ExpireSharesCommand(),
        );

        $this->assertEquals(new ShareExpiry(1, false), $expiry);
        $this->assertSame(ShareStatus::Expired, $due->refresh()->status);
        $this->assertNotSame(ShareStatus::Expired, $current->refresh()->status);
    }

    /**
     * A share the journal's owner granted on the root for a day, kept under the root's reference.
     */
    private function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        $name = $root->reference();

        return $this->journal->fixtures(ShareFixtures::class)->grantForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
