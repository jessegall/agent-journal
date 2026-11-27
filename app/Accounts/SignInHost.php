<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Contracts\SignInHost as SignInHostContract;
use App\Accounts\Enums\AccountCheckResult;
use App\Accounts\Enums\CleanupTarget;
use App\Accounts\Enums\SignInMethod;
use App\Accounts\Enums\SignInOutcome;
use App\Accounts\Exceptions\SignInRunnerRefused;
use App\Accounts\Values\ClaimedAccountCheck;
use App\Accounts\Values\ClaimedCleanup;
use App\Accounts\Values\ClaimedSignIn;
use App\Accounts\Values\CleanupProgress;
use App\Accounts\Values\SignInPoll;
use App\Api\SignedCall;
use App\Hosts\Enums\HostInstructionStatus;
use App\Projects\Enums\ArrangementType;
use App\Values\HostFolderAnswer;
use App\Values\SignInChallenge;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

/**
 * The journal over the enrolled host's signed transport: its bearer secret and a signature over each call.
 */
final readonly class SignInHost implements SignInHostContract
{
    public function __construct(
        private Factory $http,
        private string $journalUrl,
        private string $hostSecret,
        private ArrangementType $arrangement,
    ) {}

    public function claim(): ClaimedSignIn|null
    {
        $response = $this->claimFrom('profiles.sign-in-host.claim');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedSignIn(
            (string) $response->json('attempt_id'),
            (string) $response->json('driver'),
            SignInMethod::from((string) $response->json('method')),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
            (string) $response->json('expires_at'),
            self::accountIdOf($response),
        );
    }

    public function notify(
        ClaimedSignIn $claimed,
        SignInOutcome $outcome,
        SignInIdentity $identity,
        string|null $refusal = null,
    ): void {
        $body = (string) json_encode([
            'outcome' => $outcome->value,
            'generation' => $claimed->generation,
            'display' => $identity->display,
            'subject' => $identity->subject,
            'workspace' => $identity->workspace,
            'expires_at' => $identity->expiresAt,
            'refusal' => $refusal,
        ]);

        $this->send('profiles.sign-in-host.report', ['attempt' => $claimed->attemptId], $body);
    }

    public function publishChallenge(ClaimedSignIn $claimed, SignInChallenge $challenge): void
    {
        $body = (string) json_encode(['address' => $challenge->address, 'code' => $challenge->code]);

        $this->send('profiles.sign-in-host.challenge', ['attempt' => $claimed->attemptId], $body);
    }

    public function poll(ClaimedSignIn $claimed): SignInPoll
    {
        $body = (string) json_encode(['generation' => $claimed->generation]);
        $response = $this->send('profiles.sign-in-host.code', ['attempt' => $claimed->attemptId], $body);
        $code = $response->json('code');

        return new SignInPoll($response->json('live') === true, is_string($code) ? $code : null);
    }

    public function claimCheck(): ClaimedAccountCheck|null
    {
        $response = $this->claimFrom('profiles.account-host.checks.claim');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedAccountCheck(
            (string) $response->json('account_id'),
            (string) $response->json('driver'),
            SignInMethod::from((string) $response->json('method')),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
        );
    }

    public function notifyCheck(ClaimedAccountCheck $claimed, AccountCheckResult $accountCheck): void
    {
        $body = (string) json_encode(['generation' => $claimed->generation, 'result' => $accountCheck->value]);

        $this->send('profiles.account-host.check', ['account' => $claimed->accountId], $body);
    }

    public function reconcileSignIns(array $runningAttemptIds): void
    {
        $this->send(
            'profiles.sign-in-host.reconcile',
            [],
            (string) json_encode(['running' => $runningAttemptIds]),
        );
    }

    public function claimCleanup(): ClaimedCleanup|null
    {
        $response = $this->claimFrom('profiles.account-host.cleanups.claim');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedCleanup(
            CleanupTarget::from((string) $response->json('target')),
            (string) $response->json('id'),
            (string) $response->json('driver'),
            SignInMethod::from((string) $response->json('method')),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
            (bool) $response->json('store_removed'),
            self::accountIdOf($response),
        );
    }

    public function notifyCleanup(ClaimedCleanup $claimed, CleanupProgress $progress): void
    {
        $body = (string) json_encode([
            'generation' => $claimed->generation,
            'store_removed' => $progress->isStoreRemoved,
            'directory_removed' => $progress->isDirectoryRemoved,
            'still_bound' => $progress->isStillBound,
        ]);

        [$route, $parameters] = match ($claimed->target) {
            CleanupTarget::Account => [
                'profiles.account-host.cleanup',
                ['account' => $claimed->id],
            ],
            CleanupTarget::SignInAttempt => [
                'profiles.sign-in-host.cleanup',
                ['attempt' => $claimed->id],
            ],
        };

        $this->send($route, $parameters, $body);
    }

    public function instructionFolderMake(string $folder, string $operation): string
    {
        return $this->instructionFolder('profiles.account-host.folders.make', $folder, $operation);
    }

    public function instructionFolderRemove(string $folder, string $operation): string
    {
        return $this->instructionFolder('profiles.account-host.folders.remove', $folder, $operation);
    }

    public function instructionFolderUse(string $folder, string $operation): string
    {
        return $this->instructionFolder('profiles.account-host.folders.use', $folder, $operation);
    }

    public function folderAnswer(string $instructionId): HostFolderAnswer
    {
        $response = $this->send('profiles.account-host.folders.answer', ['instruction' => $instructionId], '');

        return new HostFolderAnswer(
            HostInstructionStatus::from((string) $response->json('status')),
            (string) $response->json('reason'),
            $response->json('is_bound') === true,
        );
    }

    /**
     * @throws SignInRunnerRefused
     */
    private function instructionFolder(string $route, string $folder, string $operation): string
    {
        $body = (string) json_encode(['folder' => $folder, 'operation' => $operation]);

        return (string) $this->send($route, [], $body)->json('instruction_id');
    }

    /**
     * A claim, which names this runner's arrangement so the journal refuses a runner of the other one.
     *
     * @throws SignInRunnerRefused
     */
    private function claimFrom(string $route): Response
    {
        return $this->send($route, ['arrangement' => $this->arrangement->value], '');
    }

    /**
     * @param  array<string, string>  $parameters
     *
     * @throws SignInRunnerRefused
     */
    private function send(string $route, array $parameters, string $body): Response
    {
        $path = route($route, $parameters, false);
        $callId = (string) Str::uuid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $signature = SignedCall::signatureFor($this->hostSecret, 'POST', $path, $callId, $issuedAt, $body);

        $response = $this->http
            ->withToken($this->hostSecret)
            ->withHeaders([
                SignedCall::ID_HEADER => $callId,
                SignedCall::ISSUED_AT_HEADER => (string) $issuedAt,
                SignedCall::SIGNATURE_HEADER => $signature,
            ])
            ->withBody($body, 'application/json')
            ->post(rtrim($this->journalUrl, '/').$path);

        if ($response->status() === 409) {
            throw SignInRunnerRefused::byJournal((string) $response->json('message'));
        }

        return $response->throw();
    }

    /**
     * The account a claim names, none for a new account's sign-in.
     */
    private static function accountIdOf(Response $response): string|null
    {
        $accountId = $response->json('account_id');

        if ($accountId === null) {
            return null;
        }

        return (string) $accountId;
    }
}
