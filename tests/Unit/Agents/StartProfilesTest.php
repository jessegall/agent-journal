<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\StartProfileType;
use App\Hosts\ArrangementSetting;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapability;
use App\Hosts\HostCapabilityQuery;
use App\Models\Accounts\Account;
use App\Profiles\StartProfiles;
use App\Projects\Enums\CapabilityStatusType;
use App\Support\RecordIdentity;
use App\Values\SelectedAccount;
use Tests\TestCase;

/**
 * A signed-in contained start uses the protected-account profile once its driver's account isolation is proven or
 * while the trial names it; every other start stays standard.
 */
final class StartProfilesTest extends TestCase
{
    public function test_a_signed_in_contained_start_stays_standard_until_isolation_is_proven_or_on_trial(): void
    {
        $account = new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/srv/journal/accounts/a1', 1);

        $this->assertSame(StartProfileType::Standard, $this->profiles('contained', CapabilityStatusType::Unverified, [])->for(DefaultDrivers::CLAUDE_CODE, $account));
        $this->assertSame(StartProfileType::ProtectedAccount, $this->profiles('contained', CapabilityStatusType::Unverified, [DefaultDrivers::CLAUDE_CODE])->for(DefaultDrivers::CLAUDE_CODE, $account));
        $this->assertSame(StartProfileType::Standard, $this->profiles('contained', CapabilityStatusType::Unverified, [DefaultDrivers::CLAUDE_CODE])->for(DefaultDrivers::CODEX, $account));
        $this->assertSame(StartProfileType::ProtectedAccount, $this->profiles('contained', CapabilityStatusType::Supported, [])->for(DefaultDrivers::CODEX, $account));
    }

    public function test_a_start_without_an_account_or_a_local_start_stays_standard(): void
    {
        $account = new SelectedAccount(new RecordIdentity(Account::linkType(), '01m7y41pesrb3jvbxmhd5ssfer'), 'claude-code', '/journal/accounts/a1', 1);

        $this->assertSame(StartProfileType::Standard, $this->profiles('contained', CapabilityStatusType::Supported, [DefaultDrivers::CLAUDE_CODE])->for(DefaultDrivers::CLAUDE_CODE, null));
        $this->assertSame(StartProfileType::Standard, $this->profiles('local', CapabilityStatusType::Supported, [DefaultDrivers::CLAUDE_CODE])->for(DefaultDrivers::CLAUDE_CODE, $account));
    }

    public function test_the_trial_names_its_drivers_as_a_comma_list(): void
    {
        $this->assertSame([
            DefaultDrivers::CLAUDE_CODE,
            DefaultDrivers::CODEX,
        ], StartProfiles::trialOf(' claude-code , codex '));
        $this->assertSame([], StartProfiles::trialOf(''));
    }

    /**
     * @param  list<string>  $trial
     */
    private function profiles(string $arrangement, CapabilityStatusType $isolation, array $trial): StartProfiles
    {
        $capabilities = $this->mock(HostCapabilities::class);
        $capabilities->shouldReceive('capability')->andReturnUsing(
            fn (HostCapabilityQuery $query) => new HostCapability($query, $isolation, 'Test evidence', 'Recorded for the test.'),
        );

        return new StartProfiles(ArrangementSetting::fromConfig($arrangement, 'acme', '{}'), $capabilities, $trial);
    }
}
