<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Accounts\Contracts\SignInProtocol;
use App\Accounts\Data\CodexAccountReadData;
use App\Accounts\Data\CodexLoginCompletedData;
use App\Accounts\Data\CodexLoginStartData;
use App\Accounts\Data\CodexMessageData;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Setup\SignInDriver;
use App\Agents\Exceptions\SignInChallengeUnreadable;
use App\Agents\Values\SecretHandover;
use App\Support\PrivateAccountProcess;
use App\Values\SignInCard;
use App\Values\SignInChallenge;
use App\Values\SignInHosts;
use App\Values\SignInIdentity;
use App\Values\SignInVerification;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Codex's own sign-in into one private account folder as CODEX_HOME: `codex app-server` is asked for a device-code
 * sign-in until it announces `account/login/completed`, proved by `account/read`. The address and code go only to the
 * user, and `codex login status` is the check.
 */
final readonly class CodexSignIn implements SignInProtocol
{
    private const int LOGIN_REQUEST = 1;

    private const int ACCOUNT_REQUEST = 2;

    public function signInHosts(): SignInHosts
    {
        return SignInHosts::openAi();
    }

    public function begin(SignInDriver $driver, string $directory): PrivateAccountProcess
    {
        $process = $driver->start(['app-server'], $directory, SecretHandover::none());

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

        if ($deviceCode === null) {
            return null;
        }

        return new SignInChallenge($deviceCode['address'], $deviceCode['code']);
    }

    public function canTakeAnswer(): bool
    {
        return false;
    }

    /**
     * A device sign-in's code goes out to the user only; nothing typed is ever given to the driver.
     */
    public function acceptCode(PrivateAccountProcess $process, string $code): void {}

    /**
     * Over once the driver exits or announces the completion of its own login; another login's completion and other
     * notifications are ignored.
     */
    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning() || self::completionIn($process->output()) !== null;
    }

    /**
     * Signed in only when the driver's own login completed with success, account/read on the same app-server then
     * answers a ChatGPT account, and the folder's status check agrees; the email is shown to the user only.
     */
    public function prove(SignInDriver $driver, PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $completion = self::completionIn($process->output());

        if ($completion === null || ! $completion->hasSucceeded) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $process->send(self::message(['method' => 'account/read', 'id' => self::ACCOUNT_REQUEST, 'params' => []]));

        $process->waitFor(fn (string $output) => self::answerIn($output, self::ACCOUNT_REQUEST) !== null);
        $account = self::accountIn($process->output());
        $status = $this->verify($driver, $directory);
        $isSignedIn = $account->isChatGpt() && $status->isCertain && $status->isSignedIn;
        $email = $isSignedIn ? $account->account?->email : null;

        return new SignInVerification($isSignedIn, SignInIdentity::shown($email));
    }

    public function verify(SignInDriver $driver, string $directory): SignInVerification
    {
        $status = $driver->status($directory, SecretHandover::none());

        return new SignInVerification($status->isSignedInBy(SignInMethod::OAuth), SignInIdentity::unproved(), $status->isReadable);
    }

    public function signOut(SignInDriver $driver, string $directory): void
    {
        $driver->signOut($directory);
    }

    /**
     * The address and code the user enters to approve the sign-in, from the driver's answer to the start; none
     * until it answered.
     *
     * @return array{address: string, code: string}|null
     */
    public function deviceCodeFrom(PrivateAccountProcess $process): array|null
    {
        $start = self::loginStartIn($process->output());

        if ($start === null) {
            return null;
        }

        return [
            'address' => $start->verificationUrl,
            'code' => $start->userCode,
        ];
    }

    /**
     * The completion the driver announced for the login it started, read from every line it printed.
     */
    private static function completionIn(string $output): CodexLoginCompletedData|null
    {
        $start = self::loginStartIn($output);

        if ($start === null) {
            return null;
        }

        $completions = CodexLoginCompletedData::collect(array_values(array_map(
            fn ($message) => $message->params,
            array_filter(self::messagesIn($output), fn ($message) => $message->method === 'account/login/completed'),
        )));

        return array_find(
            $completions,
            fn (CodexLoginCompletedData $completion) => $completion->loginId === $start->loginId,
        );
    }

    /**
     * The driver's answer to the login start, none until it answered; an answer that holds no readable device code
     * fails, since waiting longer never makes it one.
     */
    private static function loginStartIn(string $output): CodexLoginStartData|null
    {
        $answer = self::answerIn($output, self::LOGIN_REQUEST);

        if ($answer === null) {
            return null;
        }

        try {
            return CodexLoginStartData::from($answer->result);
        } catch (CannotCreateData|TypeError $unreadable) {
            throw SignInChallengeUnreadable::fromLoginStart($unreadable);
        }
    }

    /**
     * The account the driver's account/read answered with; signed out when it answered none it could name.
     */
    private static function accountIn(string $output): CodexAccountReadData
    {
        $answer = self::answerIn($output, self::ACCOUNT_REQUEST);

        try {
            return CodexAccountReadData::from($answer === null ? [] : $answer->result);
        } catch (CannotCreateData|TypeError) {
            return CodexAccountReadData::from([]);
        }
    }

    /**
     * The driver's answer to one of the journal's requests, by its id.
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
     * Each line the driver printed that reads as one of its messages; any other line is left out.
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

    public function card(): SignInCard
    {
        return new SignInCard(
            'Sign in with ChatGPT',
            "Enter a short code on OpenAI's site. The rest happens by itself.",
            'Your ChatGPT subscription pays for what agents use.',
            null,
        );
    }
}
