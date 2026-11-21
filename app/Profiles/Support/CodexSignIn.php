<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Data\CodexAccountReadData;
use App\Profiles\Data\CodexLoginCompletedData;
use App\Profiles\Data\CodexLoginStartData;
use App\Profiles\Data\CodexMessageData;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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

        if ($completion === null || ! $completion->success) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $process->send(self::message(['method' => 'account/read', 'id' => self::ACCOUNT_REQUEST, 'params' => []]));
        $process->waitFor(fn (string $output) => self::answerIn($output, self::ACCOUNT_REQUEST) !== null);
        $answer = self::answerIn($process->output(), self::ACCOUNT_REQUEST);
        $account = CodexAccountReadData::from($answer === null ? [] : $answer->result);
        $status = $this->verify($directory);
        $isSignedIn = $account->isChatGpt() && $status->isCertain && $status->isSignedIn;
        $email = $isSignedIn ? $account->account?->email : null;

        return new SignInVerification($isSignedIn, SignInIdentity::shown($email));
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
        $start = self::loginStartIn($process->output());

        if ($start->verificationUrl === null || $start->userCode === null) {
            return null;
        }

        return ['address' => $start->verificationUrl, 'code' => $start->userCode];
    }

    /**
     * The completion the program announced for the login it started, read from every line it printed.
     */
    private static function completionIn(string $output): CodexLoginCompletedData|null
    {
        $loginId = self::loginStartIn($output)->loginId;

        if ($loginId === null) {
            return null;
        }

        foreach (self::messagesIn($output) as $message) {
            if ($message->method !== 'account/login/completed') {
                continue;
            }

            $completion = CodexLoginCompletedData::from($message->params);

            if ($completion->loginId === $loginId) {
                return $completion;
            }
        }

        return null;
    }

    /**
     * The program's answer to the login start, empty until it answered.
     */
    private static function loginStartIn(string $output): CodexLoginStartData
    {
        $answer = self::answerIn($output, self::LOGIN_REQUEST);

        return CodexLoginStartData::from($answer === null ? [] : $answer->result);
    }

    /**
     * The program's answer to one of the journal's requests, by its id.
     */
    private static function answerIn(string $output, int $requestId): CodexMessageData|null
    {
        foreach (self::messagesIn($output) as $message) {
            if ($message->answers($requestId)) {
                return $message;
            }
        }

        return null;
    }

    /**
     * Each line the program printed that reads as one of its messages; any other line is left out.
     *
     * @return list<CodexMessageData>
     */
    private static function messagesIn(string $output): array
    {
        $messages = [];

        foreach (explode("\n", $output) as $line) {
            try {
                $messages[] = CodexMessageData::from(json_decode($line, true, 512, JSON_THROW_ON_ERROR));
            } catch (JsonException|CannotCreateData|TypeError) {
                continue;
            }
        }

        return $messages;
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
