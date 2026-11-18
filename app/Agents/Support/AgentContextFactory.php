<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Exceptions\CallProtocolUnsupported;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\CredentialRejected;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

/**
 * Builds the context of one agent request from its launch credential and signed call; ids in the body or other headers count for nothing.
 */
final readonly class AgentContextFactory
{
    public function __construct(private CredentialLookup $credentials) {}

    public function fromRequest(Request $request): AgentContext
    {
        return AgentContext::ofSession($this->credentials->sessionFor(self::tokenOf($request)), $this->verifiedCall($request));
    }

    private static function tokenOf(Request $request): string
    {
        return $request->bearerToken() ?? throw CredentialRejected::missing();
    }

    private function verifiedCall(Request $request): SignedCall
    {
        $token = self::tokenOf($request);
        $protocol = $this->header($request, SignedCall::PROTOCOL_HEADER);

        if ($protocol !== SignedCall::PROTOCOL) {
            throw CallProtocolUnsupported::version($protocol);
        }

        $callId = $this->header($request, SignedCall::ID_HEADER);
        $issuedAt = (int) $this->header($request, SignedCall::ISSUED_AT_HEADER);
        $signature = $this->header($request, SignedCall::SIGNATURE_HEADER);
        $bodyDigest = SignedCall::digestOf($request->getContent());

        if (! hash_equals(SignedCall::signatureFor($token, $request->getMethod(), $request->getRequestUri(), $callId, $issuedAt, $request->getContent()), $signature)) {
            throw CallSignatureInvalid::mismatched($callId);
        }

        return new SignedCall($callId, CarbonImmutable::createFromTimestamp($issuedAt), $bodyDigest);
    }

    private function header(Request $request, string $name): string
    {
        return $request->headers->get($name) ?? throw CallSignatureInvalid::missing($name);
    }
}
