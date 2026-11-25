<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\DismissAccountNotice\DismissAccountNoticeCommand;
use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Data\Accounts\AccountNoticesData;
use App\Declarations\SlotContext;
use App\Enums\Accounts\AccountNoticeReason;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverFailure;
use App\Enums\Drivers\DriverType;
use App\Enums\Starts\StartOriginType;
use App\Events\Sessions\DriverFailed;
use App\Exceptions\AccountUnavailable;
use App\Http\Pages\Resolvers\AccountNoticesSection;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountNotice;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A refused start and a failure the owner can act on leave a notice for the driver, without any account or session
 * kept; the owner sees it in the bar, dismisses it, or a working account resolves it; nobody else sees it.
 */
#[TimeLimit(seconds: 4, reason: 'It commits starts and notices through the bus and empties many tables.')]
final class AccountNoticesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'start_records',
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

    public function test_a_start_refused_for_want_of_an_account_leaves_one_counted_notice(): void
    {
        $agent = Agent::create('Waiting agent', 'read-only-helper');

        $this->refusedStart($agent);
        $this->refusedStart($agent);

        $notice = AccountNotice::query()->sole();
        $this->assertSame([AccountNoticeReason::NoAccount, 2], [$notice->reason, $notice->times]);
        $this->assertSame([$notice->id], array_map(fn ($data) => $data->id, $this->section()->notices));
    }

    public function test_only_failures_the_owner_can_act_on_leave_a_notice(): void
    {
        event(new DriverFailed('agent', 'session', 'codex', DriverFailure::ServerError));
        event(new DriverFailed('agent', 'session', 'codex', DriverFailure::AuthenticationFailed));

        $this->assertSame(AccountNoticeReason::SignInRejected, AccountNotice::query()->sole()->reason);
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
            ActorContext::forAgent(TestIds::of(9)),
            TestStartAuthority::forAgent(TestIds::of(9)),
        );
        $this->assertSame([], $this->section()->notices);
    }

    private function refusedStart(Agent $agent): void
    {
        $request = new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );

        try {
            $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
            $this->fail('A start ran without an account.');
        } catch (AccountUnavailable) {
            $this->actAsOwner();
        }
    }

    private function section(): AccountNoticesData
    {
        return $this->app->make(AccountNoticesSection::class)->read(SlotContext::nothing());
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
