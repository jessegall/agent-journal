<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInVerification;
use Illuminate\Contracts\Config\Repository;

/**
 * Codex's own sign-in on the host, into one private account folder: the folder as CODEX_HOME with its sign-in kept
 * in its own auth.json, then `codex app-server` asked for a device-code sign-in (`account/login/start`, type
 * `chatgptDeviceCode`) until it announces `account/login/completed`. The address and code go only to the user; the
 * program exchanges every token itself. `codex login status` is the check.
 */
final readonly class CodexSignIn implements SignInProtocol
{
    private const int LOGIN_REQUEST = 1;

    public function __construct(private Repository $config) {}

    public function begin(string $directory): PrivateAccountProcess
    {
        self::useFileCredentialStore($directory);
        $arguments = [$this->program(), 'app-server'];
        $process = PrivateAccountProcess::start($arguments, $this->environment($directory), $directory);
        $process->send(self::message([
            'method' => 'initialize',
            'id' => 0,
            'params' => ['clientInfo' => ['name' => 'journal', 'version' => '6']],
        ]));
        $process->send(self::message(['method' => 'initialized']));
        $process->send(self::message([
            'method' => 'account/login/start',
            'id' => self::LOGIN_REQUEST,
            'params' => ['type' => 'chatgptDeviceCode'],
        ]));

        return $process;
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        $deviceCode = $this->deviceCodeFrom($process);

        return $deviceCode === null ? null : new SignInChallenge($deviceCode['address'], $deviceCode['code']);
    }

    /**
     * A device sign-in's code goes out to the user only; nothing typed is ever given to the program.
     */
    public function acceptCode(PrivateAccountProcess $process, string $code): void {}

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning() || $this->messageWith($process, 'method', 'account/login/completed') !== null;
    }

    public function verify(string $directory): SignInVerification
    {
        $arguments = [$this->program(), 'login', 'status'];
        $status = PrivateAccountProcess::start($arguments, $this->environment($directory), $directory);
        $status->finish();
        $isSignedIn = $status->exitCode() === 0 && is_file($directory.'/auth.json');

        return new SignInVerification($isSignedIn, null, in_array($status->exitCode(), [0, 1], true));
    }

    public function signOut(string $directory): void
    {
        PrivateAccountProcess::start([$this->program(), 'logout'], $this->environment($directory), $directory)
            ->finish();
    }

    /**
     * The address and code the user enters to approve the sign-in, from the program's answer to the start; none
     * until it answered.
     *
     * @return array{address: string, code: string}|null
     */
    public function deviceCodeFrom(PrivateAccountProcess $process): array|null
    {
        $answer = $this->messageWith($process, 'id', self::LOGIN_REQUEST);
        $result = is_array($answer['result'] ?? null) ? $answer['result'] : [];

        if (! is_string($result['verificationUrl'] ?? null) || ! is_string($result['userCode'] ?? null)) {
            return null;
        }

        return ['address' => $result['verificationUrl'], 'code' => $result['userCode']];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function messageWith(PrivateAccountProcess $process, string $field, string|int $value): array|null
    {
        foreach (explode("\n", $process->output()) as $line) {
            $message = json_decode($line, true);

            if (is_array($message) && ($message[$field] ?? null) === $value) {
                return $message;
            }
        }

        return null;
    }

    /**
     * One line of the app-server protocol.
     *
     * @param  array<string, mixed>  $fields
     */
    private static function message(array $fields): string
    {
        return (string) json_encode($fields, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }

    /**
     * The account's configuration keeps its sign-in in the folder's own auth.json, never a keyring shared with other
     * accounts or the user's own login.
     */
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

    private function program(): string
    {
        return $this->config->string('accounts.codex_program');
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
        ];
    }
}
