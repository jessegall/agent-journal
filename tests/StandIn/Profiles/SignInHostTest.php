<?php

declare(strict_types=1);

namespace Tests\StandIn\Profiles;

use App\Contracts\Files\Files;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInOutcome;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use App\Support\SignInProtocols;
use App\Values\ClaimedSignIn;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Tests\Fixtures\Profiles\ClosedInputProtocol;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\LingeringProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host's sign-in runner: a start names only its program and carries its method, and the runner stops a program
 * its answer could not reach or at its deadline, makes the account folder private, stops when the journal ended the
 * attempt, and fails a method or program it cannot serve.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
final class SignInHostTest extends TestCase
{
    private const string FRESH_SIGN_IN = 'start a fresh sign-in';

    private User|null $owner = null;

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
    }

    protected function tearDown(): void
    {
        exec('rm -rf '.escapeshellarg($this->root));
        parent::tearDown();
    }

    public function test_the_runner_stops_a_program_its_answer_could_not_reach_and_reports_it_interrupted(): void
    {
        $directory = $this->root.'/new-account';
        $host = new RecordingSignInHost(self::claimed('claude-code', SignInMethod::OAuth, $directory));
        $host->answer = '1234';
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, ClosedInputProtocol::class);

        new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => usleep(10_000),
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        )->runNext();

        $this->assertSame([SignInOutcome::Waiting, SignInOutcome::Interrupted], $host->outcomes);
        $this->assertStringContainsString(self::FRESH_SIGN_IN, (string) end($host->refusals));
    }

    public function test_the_runner_stops_a_program_at_its_deadline_and_proves_nothing(): void
    {
        $directory = $this->root.'/new-account';
        $host = new RecordingSignInHost(new ClaimedSignIn(
            'attempt-1',
            'claude-code',
            SignInMethod::OAuth,
            $directory,
            0,
            CarbonImmutable::now()->addMilliseconds(300)->toIso8601ZuluString('millisecond'),
            null,
        ));
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, LingeringProtocol::class);

        $ran = new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => usleep(50_000),
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        )->runNext();

        $this->assertTrue($ran);
        $this->assertSame([SignInOutcome::Waiting], $host->outcomes);
    }

    public function test_the_runner_makes_the_folder_private_and_reports_what_the_check_says(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::OAuth, $directory);
        $host = new RecordingSignInHost($claimed);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, FinishingProtocol::class);

        $ran = new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => usleep(10_000),
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        )->runNext();

        $this->assertTrue($ran);
        $this->assertSame([SignInOutcome::Waiting, SignInOutcome::Verified], $host->outcomes);
        $this->assertSame(['work@example.test'], array_values(array_filter($host->identities)));
        $this->assertSame('0700', substr(sprintf('%o', fileperms($directory)), -4));
    }

    public function test_an_attempt_the_journal_ended_stops_the_program_and_reports_nothing_more(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::OAuth, $directory);
        $host = new RecordingSignInHost($claimed);
        $host->livePolls = 2;
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, LingeringProtocol::class);

        new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => usleep(10_000),
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        )->runNext();

        $this->assertSame([SignInOutcome::Waiting], $host->outcomes);
        $this->assertSame(2, $host->pollCount);
    }

    public function test_a_method_the_host_cannot_serve_fails_its_sign_in(): void
    {
        $directory = $this->root.'/new-account';
        $claimed = self::claimed('claude-code', SignInMethod::ApiKey, $directory);
        $host = new RecordingSignInHost($claimed);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('claude-code', SignInMethod::OAuth, FinishingProtocol::class);

        new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        )->runNext();

        $this->assertSame([SignInOutcome::Failed], $host->outcomes);
    }

    public function test_a_program_without_an_installed_protocol_fails_its_sign_in(): void
    {
        $claimed = self::claimed('codex', SignInMethod::OAuth, $this->root.'/x');
        $host = new RecordingSignInHost($claimed);

        new PrivateSignInProcesses(
            $host,
            new SignInProtocols($this->app),
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        )->runNext();

        $this->assertSame([SignInOutcome::Failed], $host->outcomes);
    }

    /**
     * A sign-in this test's host took, far from its deadline.
     */
    private static function claimed(string $driver, SignInMethod $method, string $directory): ClaimedSignIn
    {
        return new ClaimedSignIn('attempt-1', $driver, $method, $directory, 0, '2099-01-01T00:00:00+00:00', null);
    }
}
