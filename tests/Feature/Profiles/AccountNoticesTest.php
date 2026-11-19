<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Enums\ProgramFailure;
use App\Agents\Events\ProgramFailed;
use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Models\Agent;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchRequest;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Profiles\AccountNoticesData;
use App\Profiles\Commands\DismissAccountNotice;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Resolvers\AccountNoticesSection;
use App\Profiles\Values\AccountLabel;
use App\Programs\Enums\HookProgram;
use App\Ui\Declarations\SlotContext;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestLaunchAuthority;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A refused launch and a failure the owner can act on leave a notice for the program, without any account or session
 * kept; the owner sees it in the bar, dismisses it, or a working account resolves it; nobody else sees it.
 */
#[TimeLimit(seconds: 4, reason: 'It commits launches and notices through the bus and empties many tables.')]
final class AccountNoticesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'launch_records',
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

    public function test_a_launch_refused_for_want_of_an_account_leaves_one_counted_notice(): void
    {
        $agent = Agent::named('Waiting agent', 'read-only-helper');

        $this->refusedLaunch($agent);
        $this->refusedLaunch($agent);

        $notice = AccountNotice::query()->sole();
        $this->assertSame([AccountNoticeReason::NoAccount, 2], [$notice->reason, $notice->times]);
        $this->assertSame([$notice->id], array_map(fn ($data) => $data->id, $this->section()->notices));
    }

    public function test_only_failures_the_owner_can_act_on_leave_a_notice(): void
    {
        event(new ProgramFailed('agent', 'session', 'codex', ProgramFailure::ServerError));
        event(new ProgramFailed('agent', 'session', 'codex', ProgramFailure::AuthenticationFailed));

        $this->assertSame(AccountNoticeReason::SignInRejected, AccountNotice::query()->sole()->reason);
    }

    public function test_dismissing_or_choosing_a_working_account_resolves_notices_and_an_agent_sees_none(): void
    {
        event(new ProgramFailed('agent', 'session', 'codex', ProgramFailure::RateLimit));
        event(new ProgramFailed('agent', 'session', 'claude-code', ProgramFailure::AuthenticationFailed));
        $codexNotice = AccountNotice::query()->where('program', 'codex')->sole();

        $this->app->make(CommandBus::class)->run(new DismissAccountNotice($codexNotice->id));
        $account = Account::signedIn(HookProgram::ClaudeCode, AccountLabel::from('Work'), '/journal/accounts/work');
        $this->app->make(CommandBus::class)->run(new SwitchAccount($account->id));

        $this->assertSame([], $this->section()->notices);
        event(new ProgramFailed('agent', 'session', 'codex', ProgramFailure::RateLimit));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(9)),
            TestLaunchAuthority::forAgent(TestIds::of(9)),
        );
        $this->assertSame([], $this->section()->notices);
    }

    private function refusedLaunch(Agent $agent): void
    {
        $request = new LaunchRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            LaunchOriginType::MainLaunch,
            null,
            null,
            ConversationModeType::New,
            null,
            LaunchPolicy::withoutProfile(TestSelections::onHost()),
        );

        try {
            $this->app->make(CommandBus::class)->run(new LaunchAgent($request));
            $this->fail('A launch ran without an account.');
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
