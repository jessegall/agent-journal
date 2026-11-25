<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Data\Accounts\CodexEventData;
use App\Enums\Files\Permissions;
use App\Enums\Files\Place;
use App\Values\CodexStatus;
use App\Values\FilePath;
use Illuminate\Contracts\Config\Repository;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Codex as every sign-in method runs it on the host: the configured driver, with the account folder as its
 * CODEX_HOME and HOME and its sign-in kept in that folder's own auth.json, never a keyring shared with other accounts
 * or the user's own login; `codex login status` is its check.
 */
final readonly class CodexDriver
{
    public function __construct(
        private Repository $config,
        private SignInEgress $egress,
        private Files $files,
    ) {}

    /**
     * Runs the driver in the account folder, its file credential store set first.
     *
     * @param  list<string>  $arguments
     */
    public function start(array $arguments, string $directory): PrivateAccountProcess
    {
        $this->useFileCredentialStore($directory);
        $command = [$this->config->string('accounts.codex_program'), ...$arguments];

        return PrivateAccountProcess::start($command, $this->environment($directory), $directory);
    }

    /**
     * What one short request says against the provider: nothing when Codex's turn completes, the provider's refusal
     * when it fails, within a minute and a half, since Codex retries a refused request ten times. Codex saves any key
     * unchecked, so this request is the only proof the key works.
     */
    public function modelRefusal(string $directory): string|null
    {
        $secondsLimit = 90;
        $process = $this->start([
            'exec',
            '--json',
            '--skip-git-repo-check',
            'Reply with OK.',
        ], $directory);
        $process->closeInput();

        foreach (explode("\n", $process->finish($secondsLimit)) as $line) {
            try {
                $event = CodexEventData::from(json_decode($line, true, 64, JSON_THROW_ON_ERROR));
            } catch (JsonException|CannotCreateData|TypeError) {
                continue;
            }

            if ($event->type === 'turn.completed') {
                return null;
            }

            if ($event->type === 'turn.failed') {
                if ($event->error === null) {
                    return 'Codex could not reach the model.';
                }

                return $event->error->message;
            }
        }

        return 'Codex gave no readable answer.';
    }

    public function status(string $directory): CodexStatus
    {
        $process = $this->start([
            'login',
            'status',
        ], $directory);
        $output = $process->finish();

        $isSignedIn = $this->files->exists($this->accountFile($directory, 'auth.json'));

        return new CodexStatus($process->exitCode(), $output, $isSignedIn);
    }

    /**
     * Signs the folder's account out with the driver's own command and removes what it kept, so a later check is
     * certain the folder is signed out.
     */
    public function signOut(string $directory): void
    {
        $this->start(['logout'], $directory)->finish();

        $this->files->delete($this->accountFile($directory, 'auth.json'));
    }

    private function useFileCredentialStore(string $directory): void
    {
        $file = $this->accountFile($directory, 'config.toml');
        $config = $this->files->exists($file) ? $this->files->read($file) : '';

        if (preg_match('/^\s*cli_auth_credentials_store\s*=/m', $config) === 1) {
            $setting = 'cli_auth_credentials_store = "file"';
            $config = (string) preg_replace('/^\s*cli_auth_credentials_store\s*=.*$/m', $setting, $config);
        } else {
            $config = 'cli_auth_credentials_store = "file"'.PHP_EOL.$config;
        }

        $this->files->write($file, $config, Permissions::OwnerOnly);
    }

    /**
     * A file of the account folder, in the private place of the accounts.
     */
    private function accountFile(string $directory, string $name): FilePath
    {
        return $this->files->pathIn(Place::Accounts, $directory)->child($name);
    }

    /**
     * @return array<string, string>
     */
    private function environment(string $directory): array
    {
        return [
            'PATH' => (string) getenv('PATH'),
            'HOME' => $directory,
            'CODEX_HOME' => $directory,
            ...$this->egress->variables(),
        ];
    }
}
