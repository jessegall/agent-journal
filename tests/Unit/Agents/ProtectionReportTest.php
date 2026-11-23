<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Values\ProtectedItem;
use App\Values\ProtectionReport;
use PHPUnit\Framework\TestCase;

/**
 * A protection report awaits only its evidence when every item has its mechanism and the recorded run alone is
 * missing: the state a protected-account trial starts in (doc 78 revision 2, task 1772).
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

    private function report(ProtectedItem ...$items): ProtectionReport
    {
        return new ProtectionReport('claude-code', '2.1.323', 'linux-container-protected', array_values($items));
    }
}
