<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\AccountState;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Sessions\StartUnavailableReason;
use App\Exceptions\AccountLabelInvalid;
use App\Exceptions\AccountUnavailable;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The saved accounts, their selection rows and sign-in attempts: only the owner reads them, a driver has one
 * selection row, one attempt at a time writes an account's folder, and a removed account keeps its row and label.
 */
final class AccountStorageTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsOwner();
    }

    public function test_the_owner_reads_accounts_and_an_agent_reads_none(): void
    {
        $account = $this->account('Work');
        ActiveAccount::findLockedFor(DefaultDrivers::CLAUDE_CODE)->select($account);
        $this->actAsAgent();

        $this->assertSame(0, Account::query()->count());
        $this->assertNull(Account::query()->find($account->id));
        $this->assertSame(0, ActiveAccount::query()->count());

        $this->actAsOwner();
        $this->assertSame([$account->id], Account::query()->pluck('id')->all());
    }

    public function test_a_program_has_one_selection_row_whose_change_number_only_grows(): void
    {
        $work = $this->account('Work');
        $home = $this->account('Home');

        $selection = ActiveAccount::findLockedFor(DefaultDrivers::CLAUDE_CODE);
        $selection->select($work);
        $selection->select($work);
        $selection->select($home);
        ActiveAccount::findLockedFor(DefaultDrivers::CLAUDE_CODE)->clear();

        $row = ActiveAccount::findLockedFor(DefaultDrivers::CLAUDE_CODE);
        $this->assertSame(1, ActiveAccount::query()->count());
        $this->assertNull($row->account_id);
        $this->assertTrue($row->has_selected);
        $this->assertSame(3, $row->change_number);
    }

    public function test_a_second_start_rejoins_the_writer_and_only_a_new_writer_starts_a_generation(): void
    {
        $account = $this->account('Work');
        $first = SignInAttempt::create(
            ActorIdentity::system(),
            $account,
            SignInMethod::OAuth,
            '/journal/accounts/staging-request-1',
            CarbonImmutable::now()->addMinutes(10),
        );
        $second = SignInAttempt::create(
            ActorIdentity::system(),
            $account,
            SignInMethod::OAuth,
            '/journal/accounts/staging-request-2',
            CarbonImmutable::now()->addMinutes(10),
        );

        $this->assertSame($first->id, $account->writerFor($first));
        $this->assertSame($first->id, $account->writerFor($second));
        $this->assertTrue($account->isGeneration(2));

        $account->releaseWriter($second->id);
        $this->assertSame($first->id, $account->live_writer_attempt_id);
        $account->releaseWriter($first->id);

        $this->assertSame($second->id, $account->writerFor($second));
        $this->assertTrue($account->isGeneration(3));
        $this->assertFalse($account->isGeneration(2));
        $this->assertSame($first->id, SignInAttempt::findLiveFor(DefaultDrivers::CLAUDE_CODE, $account)?->id);
    }

    public function test_a_held_or_unsigned_account_refuses_starts_with_a_safe_reason(): void
    {
        $account = $this->account('Work');
        $account->assertAvailable();
        $this->assertSame('/journal/accounts/work', $account->directoryForStart());

        $account->beginRemoval();

        try {
            $account->assertAvailable();
            $this->fail('A start was allowed on an account being removed.');
        } catch (AccountUnavailable $refused) {
            $this->assertSame(StartUnavailableReason::Maintenance, $refused->reason);
        }
    }

    public function test_a_removed_account_keeps_its_row_and_label_and_frees_the_name(): void
    {
        $removed = $this->account('Work');
        $removed->beginRemoval();
        $removed->finishRemoval();

        $again = $this->account('WORK');

        $removed->refresh();
        $this->assertSame(AccountState::Removed, $removed->state);
        $this->assertSame(['Work', null], [$removed->label, $removed->directory]);
        $this->assertSame('core.accounts.account', $removed->recordIdentity->type);
        $this->assertNotSame($removed->id, $again->id);
        $this->expectException(QueryException::class);

        $this->account('work');
    }

    public function test_a_label_is_trimmed_and_never_a_path_or_control_text(): void
    {
        $this->assertSame('Work', AccountLabel::from('  Work ')->label);
        $this->assertSame('work', AccountLabel::from('Work')->key());

        foreach (['', '   ', str_repeat('a', 81), '../home', 'a\\b', "line\nbreak"] as $text) {
            try {
                AccountLabel::from($text);
                $this->fail("The label \"{$text}\" was accepted.");
            } catch (AccountLabelInvalid) {
                $this->addToAssertionCount(1);
            }
        }
    }

    public function test_the_private_folder_and_references_never_serialize(): void
    {
        $account = $this->account('Work');
        $attempt = SignInAttempt::create(
            ActorIdentity::system(),
            DefaultDrivers::CODEX,
            SignInMethod::OAuth,
            '/journal/accounts/new-home',
            CarbonImmutable::now()->addMinutes(10),
        );

        $this->assertArrayNotHasKey('directory', $account->toArray());
        $this->assertArrayNotHasKey('live_writer_attempt_id', $account->toArray());
        $this->assertArrayNotHasKey('request_key', $attempt->toArray());
        $this->assertArrayNotHasKey('process_reference', $attempt->toArray());
    }

    private function account(string $label): Account
    {
        $directory = '/journal/accounts/'.Str::lower($label);

        return Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from($label), $directory);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function actAsAgent(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(9)),
            TestStartAuthority::forAgent(TestIds::of(9)),
        );
    }
}
