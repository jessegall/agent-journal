<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Commands\DismissAccountNotice\DismissAccountNoticeCommand;
use App\Accounts\Commands\SwitchAccount\SwitchAccountCommand;
use App\Accounts\Data\AccountNoticesData;
use App\Accounts\Values\AccountLabel;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverFailure;
use App\Bus\Contracts\CommandBus;
use App\Declarations\SlotContext;
use App\Events\Sessions\DriverFailed;
use App\Http\Pages\Resolvers\AccountNoticesSection;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountNotice;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Dismissing a notice or choosing a working account resolves the notices, and an agent sees none.
 */
#[TimeLimit(seconds: 4, reason: 'It commits starts and notices through the bus and empties many tables.')]
#[TestsCommand(DismissAccountNoticeCommand::class)]
final class DismissAccountNoticeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'session_requests',
        'accounts',
        'active_accounts',
        'account_notices',
        'command_receipts',
        'links',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsOwner();
    }

    public function test_dismissing_or_choosing_a_working_account_resolves_notices_and_an_agent_sees_none(): void
    {
        event(new DriverFailed('agent', 'session', 'codex', DriverFailure::RateLimit));
        event(new DriverFailed('agent', 'session', 'claude-code', DriverFailure::AuthenticationFailed));
        $codexNotice = AccountNotice::query()->where('driver', 'codex')->sole();

        $this->app->make(CommandBus::class)->run(new DismissAccountNoticeCommand($codexNotice->id));
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Work'), '/journal/accounts/work');
        $this->app->make(CommandBus::class)->run(new SwitchAccountCommand($account->id));

        $this->assertSame([], $this->section()->notices);
        event(new DriverFailed('agent', 'session', 'codex', DriverFailure::RateLimit));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent(TestIds::of(9)),
            TestStartAuthority::forAgent(TestIds::of(9)),
        );
        $this->assertSame([], $this->section()->notices);
    }

    private function section(): AccountNoticesData
    {
        return $this->app->make(AccountNoticesSection::class)->read(SlotContext::nothing());
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
