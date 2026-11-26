<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Accounts\Enums\CommandEntry;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Sharing\Commands\ExpireShares\ExpireSharesCommand;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\ShareExpiry;
use App\Support\RecordIdentity;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\SharingTestCase;
use Tests\Support\TestActors;

/**
 * The sharing supervisor ends every share past its deadline as expired and counts them; a share still within its
 * deadline stays as it is.
 */
#[TestsCommand(ExpireSharesCommand::class)]
final class ExpireSharesTest extends SharingTestCase
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
        $due = $this->shareForADay(TestActors::record('binders.binder', 1), $configuration);
        $this->travel(2)->days();
        $current = $this->shareForADay(TestActors::record('binders.binder', 2), $configuration);

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

        return $this->journal->shareForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
