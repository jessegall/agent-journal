<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\AgentRequests\Support\SignedCall;
use App\Profiles\Contracts\SignInHost;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedAccountCheck;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\ClaimedSignIn;
use App\Profiles\Values\CleanupProgress;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInPoll;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

/**
 * The journal over the enrolled host's signed transport: its bearer secret and a signature over each call.
 */
final readonly class SignedSignInHost implements SignInHost
{
    public function __construct(
        private Factory $http,
        private string $journalUrl,
        private string $hostSecret,
    ) {}

    public function claim(): ClaimedSignIn|null
    {
        $response = $this->send('profiles.sign-in-host.claim', [], '');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedSignIn(
            (string) $response->json('attempt_id'),
            (string) $response->json('program'),
            SignInMethod::from((string) $response->json('method')),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
            (string) $response->json('expires_at'),
        );
    }

    public function report(ClaimedSignIn $claimed, SignInOutcome $outcome, SignInIdentity $identity): void
    {
        $body = (string) json_encode([
            'outcome' => $outcome->value,
            'generation' => $claimed->generation,
            'display' => $identity->display,
            'subject' => $identity->subject,
            'workspace' => $identity->workspace,
            'expires_at' => $identity->expiresAt,
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
        $response = $this->send('profiles.account-host.checks.claim', [], '');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedAccountCheck(
            (string) $response->json('account_id'),
            (string) $response->json('program'),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
        );
    }

    public function reportCheck(ClaimedAccountCheck $claimed, AccountCheckResult $accountCheck): void
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
        $response = $this->send('profiles.account-host.cleanups.claim', [], '');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedCleanup(
            CleanupTarget::from((string) $response->json('target')),
            (string) $response->json('id'),
            (string) $response->json('program'),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
            (bool) $response->json('store_removed'),
        );
    }

    public function reportCleanup(ClaimedCleanup $claimed, CleanupProgress $progress): void
    {
        $body = (string) json_encode([
            'generation' => $claimed->generation,
            'store_removed' => $progress->isStoreRemoved,
            'directory_removed' => $progress->isDirectoryRemoved,
        ]);
        [$route, $parameters] = match ($claimed->target) {
            CleanupTarget::Account => ['profiles.account-host.cleanup', ['account' => $claimed->id]],
            CleanupTarget::SignInAttempt => ['profiles.sign-in-host.cleanup', ['attempt' => $claimed->id]],
        };
        $this->send($route, $parameters, $body);
    }

    /**
     * @param  array<string, string>  $parameters
     */
    private function send(string $route, array $parameters, string $body): Response
    {
        $path = route($route, $parameters, false);
        $callId = (string) Str::uuid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $signature = SignedCall::signatureFor($this->hostSecret, 'POST', $path, $callId, $issuedAt, $body);

        return $this->http
            ->withToken($this->hostSecret)
            ->withHeaders([
                SignedCall::ID_HEADER => $callId,
                SignedCall::ISSUED_AT_HEADER => (string) $issuedAt,
                SignedCall::SIGNATURE_HEADER => $signature,
            ])
            ->withBody($body, 'application/json')
            ->post(rtrim($this->journalUrl, '/').$path)
            ->throw();
    }
}
