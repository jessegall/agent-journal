<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * The helper run that empties an account's scratch folders before a start: Codex links its own executable under
 * tmp/arg0 each time the accounts service runs it, and that link would fail the account folder's check.
 */
final class AccountScratchClearTest extends TestCase
{
    public function test_a_scratch_folder_is_emptied_of_the_link_a_sign_in_left_and_the_rest_of_the_account_stays(): void
    {
        $account = sys_get_temp_dir().'/account-scratch-'.bin2hex(random_bytes(4));
        mkdir("{$account}/tmp/arg0-linux/codex-arg0abc", 0o700, true);
        symlink('/usr/local/bin/codex', "{$account}/tmp/arg0-linux/codex-arg0abc/apply_patch");
        file_put_contents("{$account}/auth.json", '{}');

        $clear = new Process(['sh', base_path('resources/host-scripts/account-scratch-clear.sh'), $account, 'tmp']);
        $clear->run();

        $this->assertSame(
            [0, true, [], true],
            [$clear->getExitCode(), is_dir("{$account}/tmp"), array_values(array_diff(scandir("{$account}/tmp") ?: [], ['.', '..'])), is_file("{$account}/auth.json")],
        );
    }
}
