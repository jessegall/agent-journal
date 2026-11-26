<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Accounts\Enums\CommandEntry;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Sharing\Enums\GatewayOperationType;
use App\Support\RecordIdentity;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;

/**
 * A new gateway run asks once for an open of every gateway that still has live shares and counts them; a gateway
 * already waiting to open is asked for nothing more.
 */
#[TestsCommand(ReopenSharedGatewaysCommand::class)]
final class ReopenSharedGatewaysTest extends SharingTestCase
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

        $this->assertSame([1, 0], [$first, $second]);

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

        return $this->journal->shareForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
