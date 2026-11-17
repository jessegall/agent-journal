<?php

declare(strict_types=1);

namespace App\Core\Agents;

use App\Core\Agents\Exceptions\CallSignatureInvalid;
use App\Core\Agents\Exceptions\CredentialRejected;
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
        $token = $request->bearerToken() ?? throw CredentialRejected::missing();
        $session = $this->credentials->sessionFor($token);
        $call = $this->verifiedCall($request, $token);

        return new AgentContext($session->agent_id, $session->id, $session->agent->role, $call);
    }

    private function verifiedCall(Request $request, string $token): SignedCall
    {
        $callId = $this->header($request, SignedCall::ID_HEADER);
        $issuedAt = (int) $this->header($request, SignedCall::ISSUED_AT_HEADER);
        $signature = $this->header($request, SignedCall::SIGNATURE_HEADER);
        $bodyDigest = SignedCall::digestOf($request->getContent());

        if (! hash_equals(SignedCall::signatureFor($token, $callId, $issuedAt, $bodyDigest), $signature)) {
            throw CallSignatureInvalid::mismatched($callId);
        }

        return new SignedCall($callId, CarbonImmutable::createFromTimestamp($issuedAt), $bodyDigest);
    }

    private function header(Request $request, string $name): string
    {
        return $request->headers->get($name) ?? throw CallSignatureInvalid::missing($name);
    }
}
