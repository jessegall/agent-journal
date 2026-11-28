<?php

declare(strict_types=1);

namespace Tests\Unit\Accounts;

use App\Agents\Drivers\DefaultDrivers;
use App\Support\Recordings\Recordings;
use Tests\Support\Recordings\RecordedProgram;
use Tests\TestCase;

/**
 * The Codex native evidence procedure, run against a mock program: the trusted empty working root keeps a work
 * folder's configuration out while trusting the folder itself lets it in, signed-in items are missing without
 * accounts, and a journal account is checked for its own file store without printing the login.
 */
final class CodexNativeEvidenceTest extends TestCase
{
    private const string FAKE_PROGRAM = __DIR__.'/../../Fixtures/Accounts/Codex/fake/codex';

    private string $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $this->accounts = sys_get_temp_dir().'/codex-evidence-'.bin2hex(random_bytes(4));
        mkdir($this->accounts.'/a', 0700, true);
    }

    protected function tearDown(): void
    {
        array_map(unlink(...), glob("{$this->accounts}/a/*") ?: []);
        rmdir("{$this->accounts}/a");
        rmdir($this->accounts);
        parent::tearDown();
    }

    public function test_without_accounts_the_account_free_items_pass_and_the_rest_are_missing(): void
    {
        $evidence = $this->evidenceOf([]);
        $results = array_column($evidence['items'], 'result', 'item');

        $this->assertSame(['codex', '0.165.0', 'shared-owner'], [
            $evidence['driver'],
            $evidence['version'],
            $evidence['arrangement'],
        ]);
        $this->assertSame('pass', $results['start-flags']);
        $this->assertSame('pass', $results['empty-account-signed-out']);
        $this->assertSame('pass', $results['trusted-work-folder-loads-its-config']);
        $this->assertSame('pass', $results['empty-root-excludes-work-folder-config']);
        $this->assertSame('missing', $results['account-a-signed-in']);
        $this->assertSame('missing', $results['parallel-refresh']);
        $this->assertSame('missing', $results['thread-identities-and-cancellation']);
    }

    public function test_a_signed_in_journal_account_keeps_its_own_file_store(): void
    {
        file_put_contents("{$this->accounts}/a/auth.json", '{"tokens":"fake-secret-token"}');
        file_put_contents("{$this->accounts}/a/config.toml", "cli_auth_credentials_store = \"file\"\n");

        $output = $this->procedureOutput(["--accounts-root={$this->accounts}", "--account-a={$this->accounts}/a"]);
        $results = array_column(json_decode($output, true, flags: JSON_THROW_ON_ERROR)['items'], 'result', 'item');

        $this->assertSame('pass', $results['account-a-signed-in']);
        $this->assertSame('pass', $results['account-a-file-store']);
        $this->assertSame('pass', $results['sign-in-survives-restart']);
        $this->assertSame('missing', $results['account-b-signed-in']);
        $this->assertStringNotContainsString('fake-secret-token', $output);
        $recording = $this->journal->service(Recordings::class)->scenario(DefaultDrivers::CODEX, 'first-start');
        $login = RecordedProgram::from($recording, ['codex', 'login', 'status'])->printedOn('stderr');
        $this->assertStringNotContainsString(trim($login), $output);
    }

    /**
     * @param  list<string>  $options
     * @return array<string, mixed>
     */
    private function evidenceOf(array $options): array
    {
        return json_decode($this->procedureOutput($options), true, flags: JSON_THROW_ON_ERROR);
    }

    /**
     * @param  list<string>  $options
     */
    private function procedureOutput(array $options): string
    {
        $command = [PHP_BINARY, __DIR__.'/../../../programs/accounts/check-codex.php', '--program='.self::FAKE_PROGRAM];
        $process = proc_open([...$command, ...$options], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
        $this->assertIsResource($process);
        $stdout = (string) stream_get_contents($pipes[1]);
        stream_get_contents($pipes[2]);

        $this->assertSame(0, proc_close($process));

        return $stdout;
    }
}
