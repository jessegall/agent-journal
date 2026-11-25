<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Data\Accounts\AccountNoticesData;
use App\Declarations\SlotContext;
use App\Enums\Accounts\AccountNoticeReason;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\AccountUnavailable;
use App\Http\Pages\Resolvers\AccountNoticesSection;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountNotice;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A start refused for want of an account leaves one counted notice for the driver, and only failures the owner can act
 * on leave a notice.
 */
#[TimeLimit(seconds: 4, reason: 'It commits starts and notices through the bus and empties many tables.')]
final class AccountNoticesTest extends TestCase
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

    public function test_a_start_refused_for_want_of_an_account_leaves_one_counted_notice(): void
    {
        $agent = Agent::create('Waiting agent', 'read-only-helper', $this->localProject());

        $this->refusedStart($agent);
        $this->refusedStart($agent);

        $notice = AccountNotice::query()->sole();
        $this->assertSame([AccountNoticeReason::NoAccount, 2], [$notice->reason, $notice->times]);
        $this->assertSame([$notice->id], array_map(fn ($data) => $data->id, $this->section()->notices));
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
