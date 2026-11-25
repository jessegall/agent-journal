<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Enums\Accounts\CommandEntry;
use Domain\Sharing\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;

/**
 * A new gateway run asks once for an open of every gateway that still has live shares and counts them; a gateway
 * already waiting to open is asked for nothing more.
 */
final class ReopenSharedGatewaysTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    private const string TRUSTED_ENTRY = 'sharing supervisor';

    public function test_a_gateway_with_live_shares_is_opened_once(): void
    {
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        TestShares::grantForADay(TestActors::record('binders.binder', 1), $configuration);
        TestShares::grantForADay(TestActors::record('binders.binder', 2), $configuration);
        $this->assertSame(0, ShareGatewayOperation::query()->count());

        $first = $this->reopen();
        $second = $this->reopen();

        $this->assertSame([1, 0], [$first, $second]);
        $this->assertSame(1, ShareGatewayOperation::query()->where('type', GatewayOperationType::Open->value)->count());
    }

    private function reopen(): int
    {
        return $this->journal()->runAsJournal(
            CommandEntry::ShareGateway,
            self::TRUSTED_ENTRY,
            new ReopenSharedGatewaysCommand((string) Str::ulid()),
        );
    }
}
