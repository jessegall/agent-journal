<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;

/**
 * Codex's own sign-in on the host, into one private account folder: the folder as CODEX_HOME with its sign-in kept
 * in its own auth.json, then `codex app-server` asked for a device-code sign-in (`account/login/start`, type
 * `chatgptDeviceCode`) until it announces `account/login/completed` for that login, proved by `account/read` on the
 * same app-server. The address and code go only to the user; the program exchanges every token itself. `codex login
 * status` is the plain check.
 */
final readonly class CodexSignIn implements SignInProtocol
{
    private const int LOGIN_REQUEST = 1;

    private const int ACCOUNT_REQUEST = 2;

    public function __construct(private CodexProgram $codex) {}

    public function begin(string $directory): PrivateAccountProcess
    {
        $process = $this->codex->start(['app-server'], $directory);
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

    /**
     * Over once the program exits or announces the completion of its own login; another login's completion and other
     * notifications are ignored.
     */
    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning() || self::completionIn($process->output()) !== null;
    }

    /**
     * Signed in only when the program's own login completed with success, account/read on the same app-server then
     * answers a ChatGPT account, and the folder's status check agrees; the email is shown to the user only.
     */
    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $completion = self::completionIn($process->output());

        if (($completion['params']['success'] ?? null) !== true) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $process->send(self::message(['method' => 'account/read', 'id' => self::ACCOUNT_REQUEST, 'params' => []]));
        $process->waitFor(fn (string $output) => self::answerIn($output, self::ACCOUNT_REQUEST) !== null);
        $account = self::answerIn($process->output(), self::ACCOUNT_REQUEST)['result']['account'] ?? null;
        $status = $this->verify($directory);
        $isSignedIn = is_array($account) && ($account['type'] ?? null) === 'chatgpt'
            && $status->isCertain && $status->isSignedIn;
        $email = is_array($account) && is_string($account['email'] ?? null) ? $account['email'] : null;

        return new SignInVerification($isSignedIn, SignInIdentity::shown($isSignedIn ? $email : null));
    }

    public function verify(string $directory): SignInVerification
    {
        return $this->codex->status($directory)->signedInAs('Logged in using ChatGPT');
    }

    public function signOut(string $directory): void
    {
        $this->codex->signOut($directory);
    }

    /**
     * The address and code the user enters to approve the sign-in, from the program's answer to the start; none
     * until it answered.
     *
     * @return array{address: string, code: string}|null
     */
    public function deviceCodeFrom(PrivateAccountProcess $process): array|null
    {
        $answer = self::answerIn($process->output(), self::LOGIN_REQUEST);
        $challengeFields = is_array($answer['result'] ?? null) ? $answer['result'] : [];

        if (! is_string($challengeFields['verificationUrl'] ?? null)
            || ! is_string($challengeFields['userCode'] ?? null)
        ) {
            return null;
        }

        return ['address' => $challengeFields['verificationUrl'], 'code' => $challengeFields['userCode']];
    }

    /**
     * The completion the program announced for the login it started, read from every line it printed.
     *
     * @return array<string, mixed>|null
     */
    private static function completionIn(string $output): array|null
    {
        $loginId = self::answerIn($output, self::LOGIN_REQUEST)['result']['loginId'] ?? null;

        foreach (self::messagesIn($output) as $message) {
            if (($message['method'] ?? null) === 'account/login/completed'
                && is_string($loginId)
                && ($message['params']['loginId'] ?? null) === $loginId
            ) {
                return $message;
            }
        }

        return null;
    }

    /**
     * The program's answer to one of the journal's requests, by its id.
     *
     * @return array<string, mixed>|null
     */
    private static function answerIn(string $output, int $requestId): array|null
    {
        foreach (self::messagesIn($output) as $message) {
            if (($message['id'] ?? null) === $requestId && ! isset($message['method'])) {
                return $message;
            }
        }

        return null;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function messagesIn(string $output): array
    {
        $messages = array_map(fn (string $line) => json_decode($line, true), explode("\n", $output));

        return array_values(array_filter($messages, is_array(...)));
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
}
