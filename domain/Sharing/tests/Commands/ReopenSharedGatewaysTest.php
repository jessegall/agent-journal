<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Enums\Accounts\CommandEntry;
use App\Support\RecordIdentity;
use Domain\Sharing\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;

/**
 * A new gateway run asks once for an open of every gateway that still has live shares and counts them; a gateway
 * already waiting to open is asked for nothing more.
 */
#[TestsCommand(ReopenSharedGatewaysCommand::class)]
final class ReopenSharedGatewaysTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TRUSTED_ENTRY = 'sharing supervisor';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_gateway_with_live_shares_is_opened_once(): void
    {
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->grantForADay(TestActors::record('binders.binder', 1), $configuration);
        $this->grantForADay(TestActors::record('binders.binder', 2), $configuration);
        $this->assertSame(0, ShareGatewayOperation::query()->count());

        $first = $this->reopen();
        $second = $this->reopen();

        $this->assertSame([
            1,
            0,
        ], [
            $first,
            $second,
        ]);
        $this->assertSame(1, ShareGatewayOperation::query()->where('type', GatewayOperationType::Open->value)->count());
    }

    private function reopen(): int
    {
        return $this->journal->runAsJournal(
            CommandEntry::ShareGateway,
            self::TRUSTED_ENTRY,
            new ReopenSharedGatewaysCommand((string) Str::ulid()),
        );
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
