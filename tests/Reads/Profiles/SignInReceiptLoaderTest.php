<?php

declare(strict_types=1);

namespace Tests\Reads\Profiles;

use App\Data\Accounts\SignInReceiptData;
use App\Data\Profiles\SignInReceiptInput;
use App\Enums\Accounts\SignInReceiptStatus;
use App\Http\Loaders\Profiles\SignInReceiptLoader;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\SignInAttempt;
use Illuminate\Support\Facades\Bus;
use Illuminate\Validation\ValidationException;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner reads what became of a sign-in start under its request key: the attempt it started is named, a key no
 * start was sent under tells nothing, and the input keeps its bounds.
 */
#[TimeLimit(seconds: 3, reason: 'It commits an attempt through the bus and empties the tables it wrote.')]
#[TestsRead(SignInReceiptLoader::class)]
final class SignInReceiptLoaderTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
        'hosts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        Bus::fake([SignInDeadline::class]);
        config(['accounts.root' => sys_get_temp_dir().'/sign-in-receipt-read-'.bin2hex(random_bytes(4))]);
    }

    public function test_the_owners_started_sign_in_is_named_by_its_key(): void
    {
        $this->actingAs($this->journal->ownerUser())
            ->withHeader('Idempotency-Key', 'tab-1')
            ->post('/accounts/sign-ins', ['driver' => 'claude-code', 'method' => 'oauth'])
            ->assertStatus(303);
        $this->journal->actAs('Owner');

        $receipt = $this->read(['key' => 'tab-1', 'driver' => 'claude-code']);

        $this->assertSame(SignInReceiptStatus::Started, $receipt->status);
        $this->assertSame(SignInAttempt::query()->withoutGlobalScopes()->sole()->id, $receipt->attemptId);
    }

    public function test_a_key_no_start_was_sent_under_tells_nothing(): void
    {
        $this->journal->actAs('Owner');

        $receipt = $this->read(['key' => 'never', 'driver' => 'claude-code']);

        $this->assertSame(SignInReceiptStatus::Unknown, $receipt->status);
    }

    public function test_a_key_past_its_bound_or_a_driver_beside_an_account_is_refused(): void
    {
        $this->assertThrows(
            fn () => SignInReceiptInput::validateAndCreate(['key' => str_repeat('k', 129), 'driver' => 'claude-code']),
            ValidationException::class,
        );
        $this->assertThrows(
            fn () => SignInReceiptInput::validateAndCreate(['key' => 'tab-1', 'driver' => 'codex', 'account' => 'a']),
            ValidationException::class,
        );
        $this->assertThrows(
            fn () => SignInReceiptInput::validateAndCreate(['key' => 'tab-1']),
            ValidationException::class,
        );
    }

    /**
     * @param  array<string, string>  $input
     */
    private function read(array $input): SignInReceiptData
    {
        return $this->app->make(SignInReceiptLoader::class)(SignInReceiptInput::validateAndCreate($input));
    }
}
