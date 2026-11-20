<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Values\CodexStatus;
use Illuminate\Contracts\Config\Repository;

/**
 * Codex as every sign-in method runs it on the host: the configured program, with the account folder as its
 * CODEX_HOME and HOME and its sign-in kept in that folder's own auth.json, never a keyring shared with other accounts
 * or the user's own login; `codex login status` is its check.
 */
final readonly class CodexProgram
{
    public function __construct(private Repository $config) {}

    /**
     * Runs the program in the account folder, its file credential store set first.
     *
     * @param  list<string>  $arguments
     */
    public function start(array $arguments, string $directory): PrivateAccountProcess
    {
        self::useFileCredentialStore($directory);
        $command = [$this->config->string('accounts.codex_program'), ...$arguments];

        return PrivateAccountProcess::start($command, self::environment($directory), $directory);
    }

    public function status(string $directory): CodexStatus
    {
        $process = $this->start(['login', 'status'], $directory);
        $output = $process->finish();

        return new CodexStatus($process->exitCode(), $output, is_file($directory.'/auth.json'));
    }

    /**
     * Signs the folder's account out with the program's own command and removes what it kept, so a later check is
     * certain the folder is signed out.
     */
    public function signOut(string $directory): void
    {
        $this->start(['logout'], $directory)->finish();

        if (is_file($directory.'/auth.json')) {
            unlink($directory.'/auth.json');
        }
    }

    private static function useFileCredentialStore(string $directory): void
    {
        $file = $directory.'/config.toml';
        $config = is_file($file) ? (string) file_get_contents($file) : '';

        if (preg_match('/^\s*cli_auth_credentials_store\s*=/m', $config) === 1) {
            $setting = 'cli_auth_credentials_store = "file"';
            $config = (string) preg_replace('/^\s*cli_auth_credentials_store\s*=.*$/m', $setting, $config);
        } else {
            $config = 'cli_auth_credentials_store = "file"'.PHP_EOL.$config;
        }

        file_put_contents($file, $config);
        chmod($file, 0600);
    }

    /**
     * @return array<string, string>
     */
    private static function environment(string $directory): array
    {
        return [
            'PATH' => (string) getenv('PATH'),
            'HOME' => $directory,
            'CODEX_HOME' => $directory,
        ];
    }
}
