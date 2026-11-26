<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Values\BoundaryMechanism;
use App\Agents\Values\BoundaryMechanisms;
use App\Profiles\Values\ProtectedItem;
use App\Projects\Values\ProtectionEvidence;
use App\Values\ProtectionReport;
use PHPUnit\Framework\TestCase;

/**
 * A protection report awaits only its evidence when every item has its mechanism and the recorded run alone is
 * missing: the state a protected-account trial starts in.
 */
final class ProtectionReportTest extends TestCase
{
    public function test_a_report_whose_items_only_lack_their_recorded_run_awaits_evidence_only(): void
    {
        $report = $this->report(
            new ProtectedItem('account-secrets', true, 'run-1', ''),
            new ProtectedItem('keychain', false, '', ProtectedItem::EVIDENCE_MISSING.': none recorded'),
        );

        $this->assertTrue($report->awaitsEvidenceOnly());
        $this->assertFalse($report->isEnforcedInContainer());
    }

    public function test_an_item_without_a_mechanism_or_an_unreported_build_does_not(): void
    {
        $withoutMechanism = $this->report(new ProtectedItem('keychain', false, '', 'unavailable'));

        $this->assertFalse($withoutMechanism->awaitsEvidenceOnly());
        $this->assertFalse($this->report()->awaitsEvidenceOnly());
    }

    public function test_a_judged_report_enforces_a_recorded_item_awaits_the_rest_and_names_a_missing_mechanism(): void
    {
        $mechanisms = BoundaryMechanisms::allUnavailable('no sandbox here')
            ->with(BoundaryItem::AccountSecrets, BoundaryMechanism::native('the bubblewrap namespace'))
            ->with(BoundaryItem::Keychain, BoundaryMechanism::native('no D-Bus socket'));
        $evidence = new ProtectionEvidence(['claude-code@2.1.323' => ['account-secrets' => 'run-7']]);

        $report = ProtectionReport::judge('claude-code', '2.1.323', IsolationPlatform::Container, $mechanisms, $evidence);
        [$secrets, , $keychain, $sockets] = $report->items;

        $this->assertSame(
            [
                [true, 'run-7'],
                [false, ProtectedItem::EVIDENCE_MISSING.': no recorded run showed it hold on this host'],
                [false, 'no native mechanism: no sandbox here'],
                false,
            ],
            [
                [$secrets->isEnforced, $secrets->evidence],
                [$keychain->isEnforced, $keychain->reason],
                [$sockets->isEnforced, $sockets->reason],
                $report->awaitsEvidenceOnly(),
            ],
        );
    }

    private function report(ProtectedItem ...$items): ProtectionReport
    {
        return new ProtectionReport('claude-code', '2.1.323', 'linux-container-protected', array_values($items));
    }
}
