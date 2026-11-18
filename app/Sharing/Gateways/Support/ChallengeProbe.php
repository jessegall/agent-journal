<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Support;

use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayHealth;
use App\Sharing\Support\ProbeChallenges;
use App\Sharing\Support\PublicAddresses;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Factory as HttpClient;

/**
 * A gateway's health probe: a single-use challenge fetched through the public origin over HTTPS, from a host that
 * resolves only to public addresses, in five seconds, without following a redirect, and answered with the challenge.
 */
final readonly class ChallengeProbe
{
    private const int SECONDS = 5;

    public function __construct(
        private HttpClient $http,
        private ProbeChallenges $challenges,
        private PublicAddresses $addresses,
    ) {}

    public function health(GatewayEndpoint $endpoint): GatewayHealth
    {
        $host = (string) parse_url($endpoint->publicOrigin, PHP_URL_HOST);

        if (! str_starts_with($endpoint->publicOrigin, 'https://') || ! $this->addresses->isPublic($host)) {
            return new GatewayHealth(['The public origin is not a public HTTPS address.']);
        }

        $challenge = $this->challenges->issue();

        try {
            $response = $this->http->timeout(self::SECONDS)->withoutRedirecting()->get(rtrim($endpoint->publicOrigin, '/')."/_probe/{$challenge}");
        } catch (ConnectionException) {
            return new GatewayHealth(['The public origin did not answer the probe in time.']);
        }

        if ($response->redirect()) {
            return new GatewayHealth(['The public origin redirected the probe.']);
        }

        return $response->ok() && substr($response->body(), 0, 64) === $challenge ? GatewayHealth::healthy() : new GatewayHealth(['The public origin did not answer the probe with its challenge.']);
    }
}
