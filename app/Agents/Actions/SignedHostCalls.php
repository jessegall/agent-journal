<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Contracts\HostCalls;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\HostCredentialRejected;
use App\Agents\Exceptions\HostProtocolMismatch;
use App\Agents\Models\Host;
use App\Agents\Values\HostContext;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Http\Request;

/**
 * Verifies a host's signed call: its credential, an HMAC over method, path, call id, issue time and body (the agent
 * call envelope), an issue time inside the window, a call id not used before inside that window and the protocol it
 * speaks. The host is found by its credential, so a relay that lost its reply needs no host id.
 */
final readonly class SignedHostCalls implements HostCalls
{
    private const int WINDOW_SECONDS = 300;

    public function __construct(private Repository $cache) {}

    /**
     * The host and envelope of a signed call speaking this protocol.
     *
     * @throws HostCredentialRejected
     * @throws CallSignatureInvalid
     * @throws HostProtocolMismatch
     */
    public function verify(Request $request, HostProtocolVersion $protocol): HostContext
    {
        $secret = $request->bearerToken() ?? throw HostCredentialRejected::missing();
        $callId = $this->header($request, SignedCall::ID_HEADER);
        $issuedAt = (int) $this->header($request, SignedCall::ISSUED_AT_HEADER);
        $signature = $this->header($request, SignedCall::SIGNATURE_HEADER);

        $expected = SignedCall::signatureOfRequest($secret, $request, $callId, $issuedAt);

        if (! hash_equals($expected, $signature)) {
            throw CallSignatureInvalid::mismatched($callId);
        }

        if (abs(CarbonImmutable::now()->getTimestamp() - $issuedAt) > self::WINDOW_SECONDS) {
            throw HostCredentialRejected::stale($issuedAt);
        }

        $host = Host::forSecret($secret);
        $this->assertSpeaksProtocol($request, $protocol);

        if (! $this->cache->add("host-call:{$host->id}:{$callId}", true, self::WINDOW_SECONDS * 2)) {
            throw HostCredentialRejected::replayed($callId);
        }

        return new HostContext(
            $host->id,
            new SignedCall(
                $callId,
                CarbonImmutable::createFromTimestamp($issuedAt),
                SignedCall::digestOf($request->getContent()),
            ),
        );
    }

    /**
     * Refuses a host of another protocol version before it can claim, report, open or recover anything.
     *
     * @throws HostProtocolMismatch
     */
    private function assertSpeaksProtocol(Request $request, HostProtocolVersion $protocol): void
    {
        $current = $protocol->value;
        $version = $request->headers->get(SignedCall::HOST_PROTOCOL_HEADER)
            ?? throw HostProtocolMismatch::missing($current);

        if ($version !== (string) $current) {
            throw HostProtocolMismatch::speaks($version, $current);
        }
    }

    private function header(Request $request, string $name): string
    {
        return $request->headers->get($name) ?? throw CallSignatureInvalid::missing($name);
    }
}
