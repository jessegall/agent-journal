<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\Programs;

use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\LaunchEnvironment;
use App\AgentRequests\Support\LaunchProfilePin;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Exceptions\OfflineReplyModeInvalid;
use App\Agents\Exceptions\OfflineReplySealInvalid;
use App\Agents\Support\OfflineReplySeal;
use App\Hooks\Relay\RelaySettings;
use PHPUnit\Framework\TestCase;

/**
 * The relay keeps working through an outage only under the seal the journal issued for this launch: a mode it never
 * grants, a changed mode, a missing seal or a seal copied from another launch is refused.
 */
final class OfflineReplySettingsTest extends TestCase
{
    private const string KEY = 'base64:test-key';

    public function test_the_sealed_mode_decides_whether_the_relay_passes_an_outage(): void
    {
        $neutral = $this->settings('neutral', $this->sealFor('launch-token', OfflineReplyMode::Neutral));
        $refusing = $this->settings('refuse', $this->sealFor('launch-token', OfflineReplyMode::Refuse));

        $this->assertTrue($neutral->passesOutages);
        $this->assertFalse($refusing->passesOutages);
    }

    public function test_a_mode_the_journal_never_grants_is_rejected(): void
    {
        $this->expectException(OfflineReplyModeInvalid::class);

        $this->settings('always', $this->sealFor('launch-token', OfflineReplyMode::Neutral));
    }

    public function test_a_mode_changed_by_hand_is_refused(): void
    {
        $this->expectException(OfflineReplySealInvalid::class);

        $this->settings('neutral', $this->sealFor('launch-token', OfflineReplyMode::Refuse));
    }

    public function test_a_seal_copied_from_another_launch_is_refused(): void
    {
        $this->expectException(OfflineReplySealInvalid::class);

        $this->settings('neutral', $this->sealFor('another-launch-token', OfflineReplyMode::Neutral));
    }

    public function test_a_missing_seal_is_refused(): void
    {
        $this->expectException(OfflineReplySealInvalid::class);

        $this->settings('neutral', '');
    }

    private function sealFor(string $token, OfflineReplyMode $mode): string
    {
        return new OfflineReplySeal(self::KEY)->seal($token, new LaunchProfilePin('main-agent', 1), $mode);
    }

    private function settings(string $mode, string $seal): RelaySettings
    {
        $client = new AgentClientSettings('http://journal.test', 'launch-token', new LaunchProfilePin('main-agent', 1));

        return RelaySettings::forLaunch($client, new LaunchEnvironment([
            'JOURNAL_OFFLINE_REPLY' => $mode,
            'JOURNAL_OFFLINE_REPLY_SEAL' => $seal,
            'JOURNAL_BYPASS_LOG' => '/tmp/bypasses.jsonl',
        ]), new OfflineReplySeal(self::KEY));
    }
}
