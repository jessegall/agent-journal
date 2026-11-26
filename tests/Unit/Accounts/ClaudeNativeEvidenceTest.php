<?php

declare(strict_types=1);

namespace Tests\Unit\Accounts;

use PHPUnit\Framework\TestCase;

/**
 * The Claude native evidence procedure, run against a stand-in program: without accounts every signed-in item is
 * missing with what it needs, with two journal accounts it compares them without printing who they are, and it never
 * reads an account outside the journal's accounts folder.
 */
final class ClaudeNativeEvidenceTest extends TestCase
{
    private const string FAKE_PROGRAM = __DIR__.'/../../Fixtures/Accounts/Claude/fake/claude';

    private string $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $this->accounts = sys_get_temp_dir().'/claude-evidence-'.bin2hex(random_bytes(4));
        mkdir($this->accounts.'/a', 0700, true);
        mkdir($this->accounts.'/b', 0700, true);
    }

    protected function tearDown(): void
    {
        foreach (['a', 'b'] as $name) {
            array_map(unlink(...), glob("{$this->accounts}/{$name}/*") ?: []);
            rmdir("{$this->accounts}/{$name}");
        }

        rmdir($this->accounts);
        parent::tearDown();
    }

    public function test_without_accounts_every_signed_in_item_is_missing_with_its_consumer(): void
    {
        $evidence = $this->evidenceOf([]);
        $results = array_column($evidence['items'], 'result', 'item');

        $this->assertSame(['claude-code', '2.1.323', 'direct-processes'], [
            $evidence['driver'],
            $evidence['version'],
            $evidence['arrangement'],
        ]);
        $this->assertSame('fail', $results['pinned-build']);
        $this->assertSame('pass', $results['start-flags']);
        $this->assertSame('pass', $results['empty-account-signed-out']);
        $this->assertSame('missing', $results['account-a-signed-in']);
        $this->assertSame('missing', $results['accounts-separate']);
        $this->assertSame('missing', $results['hostile-work-settings-ignored']);
        $this->assertSame('missing', $results['keychain-cleanup']);
        $this->assertNotContains('', array_column($evidence['items'], 'consumer'));
    }

    public function test_two_journal_accounts_are_compared_without_printing_who_they_are(): void
    {
        file_put_contents("{$this->accounts}/a/signed-in", 'first@example.test');
        file_put_contents("{$this->accounts}/b/signed-in", 'second@example.test');

        $output = $this->procedureOutput([
            "--accounts-root={$this->accounts}",
            "--account-a={$this->accounts}/a",
            "--account-b={$this->accounts}/b",
        ]);
        $results = array_column(json_decode($output, true, flags: JSON_THROW_ON_ERROR)['items'], 'result', 'item');

        $this->assertSame('pass', $results['account-a-signed-in']);
        $this->assertSame('pass', $results['accounts-separate']);
        $this->assertSame('pass', $results['sign-in-survives-restart']);
        $this->assertStringNotContainsString('example.test', $output);
        $this->assertStringNotContainsString('fake-secret-token', $output);
    }

    public function test_an_account_outside_the_journal_accounts_folder_is_refused(): void
    {
        $output = $this->procedureOutput(
            ["--accounts-root={$this->accounts}/a", "--account-a={$this->accounts}/b"],
            255,
        );

        $this->assertStringNotContainsString('"items"', $output);
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
    private function procedureOutput(array $options, int $expectedExit = 0): string
    {
        $command = [PHP_BINARY, __DIR__.'/../../../programs/accounts/check-claude.php', '--program='.self::FAKE_PROGRAM];
        $process = proc_open([...$command, ...$options], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
        $this->assertIsResource($process);
        $stdout = (string) stream_get_contents($pipes[1]);
        stream_get_contents($pipes[2]);

        $this->assertSame($expectedExit, proc_close($process));

        return $stdout;
    }
}
