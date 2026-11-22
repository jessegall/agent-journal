<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\HostCalls;
use App\Enums\HostProtocolVersion;
use App\Exceptions\CallSignatureInvalid;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostProtocolMismatch;
use App\Models\Host;
use App\Values\HostContext;
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
     * The host and envelope of a signed call speaking one of these protocols.
     *
     * @throws HostCredentialRejected
     * @throws CallSignatureInvalid
     * @throws HostProtocolMismatch
     */
    public function verify(Request $request, HostProtocolVersion ...$spoken): HostContext
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
        $protocol = $this->spokenProtocol($request, $spoken);

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
            $protocol,
        );
    }

    /**
     * The protocol the call speaks, one of those the route speaks; a host of another version is refused before it can
     * claim, report, open or recover anything.
     *
     * @param  array<HostProtocolVersion>  $spoken
     *
     * @throws HostProtocolMismatch
     */
    private function spokenProtocol(Request $request, array $spoken): HostProtocolVersion
    {
        $first = array_values($spoken)[0]->value;

        $version = $request->headers->get(SignedCall::HOST_PROTOCOL_HEADER)
            ?? throw HostProtocolMismatch::missing($first);

        foreach ($spoken as $protocol) {
            if ($version === (string) $protocol->value) {
                return $protocol;
            }
        }

        throw HostProtocolMismatch::speaks($version, $first);
    }

    private function header(Request $request, string $name): string
    {
        return $request->headers->get($name) ?? throw CallSignatureInvalid::missing($name);
    }
}
