<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Hosts\Commands\RecordProtectionEvidence\RecordProtectionEvidenceCommand;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A recorded run makes the items it showed hold enforced in the host's report; the items it did not name still wait for
 * a run of their own.
 */
#[TestsCommand(RecordProtectionEvidenceCommand::class)]
final class RecordProtectionEvidenceTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_recorded_run_enforces_the_items_it_names(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $platform = IsolationPlatform::ProtectedContainer;
        $items = [BoundaryItem::AccountSecrets, BoundaryItem::Keychain];

        $this->journal->asSystem(new RecordProtectionEvidenceCommand($hostId, DefaultDrivers::CODEX, $platform, $items, 'run-12'));
        $report = Host::query()->whereKey($hostId)->sole()->protection->items()['codex@0.165.0/linux-container-protected']->report();

        $this->journal->assertResult(
            [[true, 'run-12'], [true, 'run-12'], false, true],
            [
                [$report->items[0]->isEnforced, $report->items[0]->evidence],
                [$report->items[2]->isEnforced, $report->items[2]->evidence],
                $report->items[1]->isEnforced,
                $report->awaitsEvidenceOnly(),
            ],
        );
    }
}
