<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\MarkFailedUpgrades\MarkFailedUpgradesCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\UpgradeHost\UpgradeHostCommand;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostOrder;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An upgrade the host answered done but never followed with an inventory of the new release fails after 180 seconds,
 * so its failure shows; one whose inventory named the release in time stays settled.
 */
#[TestsCommand(MarkFailedUpgradesCommand::class)]
final class MarkFailedUpgradesTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RELEASE = '6.1.0';

    public function test_a_done_upgrade_whose_inventory_never_names_the_release_fails_after_180_seconds(): void
    {
        $this->upgradeAnsweredAt(CarbonImmutable::parse('2026-11-26 10:00:00'));
        $this->journal->asSystem(new MarkFailedUpgradesCommand());
        $waitingAt60 = $this->host()->upgrade_failure;

        $later = CarbonImmutable::parse('2026-11-26 10:04:00');
        $this->journal->travelTo($later)->useServerClockAt($later);
        $this->journal->asSystem(new MarkFailedUpgradesCommand());

        $this->journal->assertResult(
            [null, 'The host answered its upgrade but named no release 6.1.0 within 180 seconds.', null],
            [$waitingAt60, $this->host()->upgrade_failure, $this->host()->upgrade_release],
        );
    }

    public function test_an_upgrade_whose_inventory_named_the_release_stays_settled(): void
    {
        $this->upgradeAnsweredAt(CarbonImmutable::parse('2026-11-26 10:00:00'));
        $inventory = json_encode(['protocol' => 1, 'release' => self::RELEASE, 'processes' => []], JSON_THROW_ON_ERROR);
        $this->journal->asSystem(new NotifyHostInventoryCommand($this->host()->id, $inventory));

        $later = CarbonImmutable::parse('2026-11-26 10:04:00');
        $this->journal->travelTo($later)->useServerClockAt($later);
        $this->journal->asSystem(new MarkFailedUpgradesCommand());

        $this->journal->assertResult([null, self::RELEASE], [$this->host()->upgrade_failure, $this->host()->release]);
    }

    private function upgradeAnsweredAt(CarbonImmutable $at): void
    {
        $this->journal
            ->travelTo($at)
            ->useServerClockAt($at)
            ->publishRelease(self::RELEASE)
            ->enrollHost('Mac', [base_path()]);
        $this->journal->asSystem(new UpgradeHostCommand($this->journal->hostCalled('Mac')->hostId, self::RELEASE));
        $this->journal->hostOrder($this->journal->hostOrdersOn('Mac')[0], fn (TestHostOrder $order) => $order
            ->answerWith(['release' => self::RELEASE]));
    }

    private function host(): Host
    {
        return Host::query()->whereKey($this->journal->hostCalled('Mac')->hostId)->sole();
    }
}
