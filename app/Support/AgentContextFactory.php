<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Admission\StartProfileAdmission;
use App\Exceptions\CallSignatureInvalid;
use App\Exceptions\CredentialRejected;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

/**
 * Builds the context of one agent request from its start token and signed call; ids in the body or other headers
 * count for nothing.
 */
final readonly class AgentContextFactory
{
    public function __construct(private CredentialLookup $credentials, private StartProfileAdmission $profiles) {}

    /**
     * The call's context once its credential, its signature and its profile pair passed, with the admitted profile
     * revision its start was pinned to; any failure is the same rejected credential.
     *
     * @throws CredentialRejected
     * @throws CallSignatureInvalid
     */
    public function admit(Request $request): AdmittedAgent
    {
        $session = $this->credentials->sessionFor(self::tokenOf($request));
        $pin = new StartProfilePin((string) $session->profile_key, (int) $session->profile_revision);
        $context = AgentContext::ofSession($session, $this->verifiedCall($request, $pin));

        return new AdmittedAgent($context, $this->profiles->admit($pin->key, $pin->revision));
    }

    private static function tokenOf(Request $request): string
    {
        return $request->bearerToken() ?? throw CredentialRejected::missing();
    }

    private function verifiedCall(Request $request, StartProfilePin $pin): SignedCall
    {
        $token = self::tokenOf($request);
        $callId = $this->header($request, SignedCall::ID_HEADER);
        $issuedAt = (int) $this->header($request, SignedCall::ISSUED_AT_HEADER);
        $signature = $this->header($request, SignedCall::SIGNATURE_HEADER);
        $bodyDigest = SignedCall::digestOf($request->getContent());
        $claimed = $this->header($request, SignedCall::PROFILE_HEADER);
        $claimedRevision = $this->header($request, SignedCall::PROFILE_REVISION_HEADER);

        if ($claimed !== $pin->key || $claimedRevision !== (string) $pin->revision) {
            throw CredentialRejected::profileMismatched();
        }

        $expected = SignedCall::agentSignatureFor(
            $token,
            $request->getMethod(),
            $request->getRequestUri(),
            $callId,
            $issuedAt,
            $request->getContent(),
            $pin,
        );

        if (! hash_equals($expected, $signature)) {
            throw CallSignatureInvalid::mismatched($callId);
        }

        return new SignedCall($callId, CarbonImmutable::createFromTimestamp($issuedAt), $bodyDigest);
    }

    private function header(Request $request, string $name): string
    {
        return $request->headers->get($name) ?? throw CallSignatureInvalid::missing($name);
    }
}
