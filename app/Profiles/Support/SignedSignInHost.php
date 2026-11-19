<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\AgentRequests\Support\SignedCall;
use App\Profiles\Contracts\SignInHost;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedAccountCheck;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\ClaimedSignIn;
use App\Profiles\Values\CleanupProgress;
use App\Profiles\Values\SignInChallenge;
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
        $response = $this->send('/host/sign-ins/claim', '');

        if ($response->status() === 204) {
            return null;
        }

        return new ClaimedSignIn(
            (string) $response->json('attempt_id'),
            (string) $response->json('program'),
            (string) $response->json('directory'),
            (int) $response->json('generation'),
            (string) $response->json('expires_at'),
        );
    }

    public function report(ClaimedSignIn $claimed, SignInOutcome $outcome, string|null $identity): void
    {
        $body = (string) json_encode([
            'outcome' => $outcome->value,
            'generation' => $claimed->generation,
            'identity' => $identity,
        ]);
        $this->send("/host/sign-ins/{$claimed->attemptId}/report", $body);
    }

    public function publishChallenge(ClaimedSignIn $claimed, SignInChallenge $challenge): void
    {
        $body = (string) json_encode(['address' => $challenge->address, 'code' => $challenge->code]);
        $this->send("/host/sign-ins/{$claimed->attemptId}/challenge", $body);
    }

    public function pendingCode(ClaimedSignIn $claimed): string|null
    {
        $response = $this->send("/host/sign-ins/{$claimed->attemptId}/code", '');

        return $response->status() === 204 ? null : (string) $response->json('code');
    }

    public function claimCheck(): ClaimedAccountCheck|null
    {
        $response = $this->send('/host/accounts/checks/claim', '');

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

    public function reportCheck(ClaimedAccountCheck $claimed, AccountCheckResult $result): void
    {
        $body = (string) json_encode(['generation' => $claimed->generation, 'result' => $result->value]);
        $this->send("/host/accounts/{$claimed->accountId}/check", $body);
    }

    public function reconcileSignIns(array $runningAttemptIds): void
    {
        $this->send('/host/sign-ins/reconcile', (string) json_encode(['running' => $runningAttemptIds]));
    }

    public function claimCleanup(): ClaimedCleanup|null
    {
        $response = $this->send('/host/accounts/cleanups/claim', '');

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
        $path = $claimed->target === CleanupTarget::Account
            ? "/host/accounts/{$claimed->id}/cleanup"
            : "/host/sign-ins/{$claimed->id}/cleanup";
        $this->send($path, $body);
    }

    private function send(string $path, string $body): Response
    {
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
