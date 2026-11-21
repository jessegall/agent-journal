<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\LaunchProfileType;
use App\Agents\Support\ArrangementSetting;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\LaunchProfiles;
use App\Agents\Values\SelectedAccount;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Models\Account;
use App\Records\Support\RecordIdentity;
use Tests\TestCase;

/**
 * A signed-in contained start uses the protected-account profile once its driver's account isolation is proven or
 * while the trial names it; every other start stays standard (doc 78 revision 2, Delivery item 4).
 */
final class LaunchProfilesTest extends TestCase
{
    public function test_a_signed_in_contained_start_stays_standard_until_isolation_is_proven_or_on_trial(): void
    {
        $account = new SelectedAccount(new RecordIdentity(Account::LINK_TYPE, '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/srv/journal/accounts/a1', 1);

        $this->assertSame(LaunchProfileType::Standard, $this->profiles('contained', CapabilityStatusType::Unverified, [])->for(HookDriver::ClaudeCode, $account));
        $this->assertSame(LaunchProfileType::ProtectedAccount, $this->profiles('contained', CapabilityStatusType::Unverified, [HookDriver::ClaudeCode])->for(HookDriver::ClaudeCode, $account));
        $this->assertSame(LaunchProfileType::Standard, $this->profiles('contained', CapabilityStatusType::Unverified, [HookDriver::ClaudeCode])->for(HookDriver::Codex, $account));
        $this->assertSame(LaunchProfileType::ProtectedAccount, $this->profiles('contained', CapabilityStatusType::Supported, [])->for(HookDriver::Codex, $account));
    }

    public function test_a_start_without_an_account_or_a_local_start_stays_standard(): void
    {
        $account = new SelectedAccount(new RecordIdentity(Account::LINK_TYPE, '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/journal/accounts/a1', 1);

        $this->assertSame(LaunchProfileType::Standard, $this->profiles('contained', CapabilityStatusType::Supported, [HookDriver::ClaudeCode])->for(HookDriver::ClaudeCode, null));
        $this->assertSame(LaunchProfileType::Standard, $this->profiles('local', CapabilityStatusType::Supported, [HookDriver::ClaudeCode])->for(HookDriver::ClaudeCode, $account));
    }

    public function test_the_trial_names_its_drivers_as_a_comma_list(): void
    {
        $this->assertSame([HookDriver::ClaudeCode, HookDriver::Codex], LaunchProfiles::trialOf(' claude-code , codex '));
        $this->assertSame([], LaunchProfiles::trialOf(''));
    }

    /**
     * @param  list<HookDriver>  $trial
     */
    private function profiles(string $arrangement, CapabilityStatusType $isolation, array $trial): LaunchProfiles
    {
        $capabilities = $this->mock(HostCapabilities::class);
        $capabilities->shouldReceive('capability')->andReturnUsing(
            fn (HostCapabilityQuery $query) => new HostCapability($query, $isolation, 'Test evidence', 'Recorded for the test.'),
        );

        return new LaunchProfiles(ArrangementSetting::fromConfig($arrangement, 'acme', '{}'), $capabilities, $trial);
    }
}
