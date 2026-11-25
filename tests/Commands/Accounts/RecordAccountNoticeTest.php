<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Data\Accounts\AccountNoticesData;
use App\Declarations\SlotContext;
use App\Enums\Accounts\AccountNoticeReason;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartOriginType;
use App\Events\Accounts\AccountsChanged;
use App\Exceptions\AccountUnavailable;
use App\Http\Pages\Resolvers\AccountNoticesSection;
use App\Models\Accounts\AccountNotice;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Recording a notice again counts it and refreshes the page for the same notice.
 */
#[TestsCommand(RecordAccountNoticeCommand::class)]
final class RecordAccountNoticeTest extends TestCase
{
    use CommitsHookRows;
    use ServesEveryCombination;
    use WithActiveAccount;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'account_notices',
        'command_receipts',
        'users',
        'agents',
        'agent_sessions',
        'session_requests',
        'capacity_reservations',
        'session_processes',
        'session_policies',
        'session_tokens',
        'agent_runtimes',
        'driver_requests',
        'agent_stacks',
        'links',
        'settings_records',
    ];

    /**
     * @var list<array{string, string}>
     */
    private array $changes = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $this->app->make(Dispatcher::class)->listen(AccountsChanged::class, function (AccountsChanged $changed): void {
            $this->changes[] = [$changed->driver, $changed->accountId];
        });
    }

    // A failure is never swallowed, so the failing notice command is thrown, named by its fact.
    public function test_recording_the_notice_again_counts_it_and_refreshes_for_the_same_notice(): void
    {
        $record = new RecordAccountNoticeCommand('claude-code', AccountNoticeReason::NeedsSignIn);
        $journal = $this->app->make(JournalCommands::class);

        $journal->runAsJournal(CommandEntry::AccountMaintenance, 'test', $record);
        $journal->runAsJournal(CommandEntry::AccountMaintenance, 'test', $record);

        $notice = AccountNotice::query()->sole();
        $this->assertSame(2, $notice->times);
        $this->assertSame([['claude-code', $notice->id], ['claude-code', $notice->id]], $this->changes);
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

    private function section(): AccountNoticesData
    {
        return $this->app->make(AccountNoticesSection::class)->read(SlotContext::nothing());
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

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
