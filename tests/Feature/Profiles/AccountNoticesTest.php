<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\DriverFailure;
use App\Agents\Enums\StartOriginType;
use App\Agents\Events\DriverFailed;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Models\Agent;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Support\DefaultDrivers;
use App\Http\Data\Profiles\AccountNoticesData;
use App\Profiles\Commands\DismissAccountNotice\DismissAccountNoticeCommand;
use App\Profiles\Commands\SwitchAccount\SwitchAccountCommand;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Resolvers\AccountNoticesSection;
use App\Profiles\Values\AccountLabel;
use App\Ui\Declarations\SlotContext;
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
