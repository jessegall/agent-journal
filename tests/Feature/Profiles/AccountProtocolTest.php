<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Models\Account;
use App\Profiles\Values\AccountLabel;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Doc 103, Storage identities: an account is kept under its account provider's protocol, which both drivers of a
 * family share, so the terminal and the headless driver find the same account.
 */
final class AccountProtocolTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['accounts'];

    public function test_an_account_made_for_claude_code_is_found_by_its_terminal_and_headless_drivers(): void
    {
        $account = Account::create(HookDriver::ClaudeCode, AccountLabel::from('Work'), '/journal/accounts/work');
        $drivers = $this->app->make(DriverCatalogue::class);

        foreach ([DriverVariant::Terminal, DriverVariant::Headless] as $mode) {
            $protocol = $drivers->pinned(HookDriver::ClaudeCode->value, $mode)->registration->accountProtocol;

            $this->assertSame(
                [$account->id],
                Account::query()->withoutGlobalScopes()->where('account_protocol', $protocol)->pluck('id')->all(),
            );
        }
    }
}
