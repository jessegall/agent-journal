<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Ngrok;

use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Exceptions\GatewayOpenFailed;
use App\Sharing\Gateways\Support\ChallengeProbe;
use App\Sharing\Gateways\Support\GatewayAddressCheck;
use App\Sharing\Gateways\Support\GatewayChildren;
use App\Sharing\Gateways\Support\GatewayLaunches;
use App\Sharing\Gateways\Support\GatewaySecrets;
use App\Sharing\Gateways\Support\PublicOriginCheck;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayHealth;
use App\Sharing\Support\GatewayOperation;
use App\Sharing\Support\GatewayReadiness;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Factory as HttpClient;
use Illuminate\Process\Factory as Processes;

/**
 * The ngrok gateway on a fixed HTTPS origin only: the pinned ngrok program with its own configuration file (the
 * authtoken from its secret, the control API on loopback, no inspection or request log), started for the share
 * listener, and accepted only when its loopback control API reports the configured origin forwarding to that
 * listener. A random address is never used; endpoints of other upstreams are ignored.
 */
final readonly class NgrokGateway implements ShareGateway
{
    public const string KEY = 'ngrok';

    private const int VERSION_SECONDS = 10;

    public function __construct(
        private Processes $processes,
        private HttpClient $http,
        private GatewayChildren $children,
        private GatewayLaunches $launches,
        private GatewaySecrets $secrets,
        private PublicOriginCheck $origins,
        private ChallengeProbe $probe,
        #[Config('sharing.ngrok.binary')] private string $binary,
        #[Config('sharing.ngrok.config_dir')] private string $configFolder,
        #[Config('sharing.ngrok.control_port')] private int $controlPort,
    ) {}

    public function readiness(GatewayConfiguration $configuration): GatewayReadiness
    {
        if (! is_file($this->binary) || ! is_executable($this->binary)) {
            return new GatewayReadiness(['The ngrok program is not installed at its pinned path.']);
        }

        $settings = $configuration->settings;
        $problems = [];

        if (! str_starts_with($settings->publicOrigin, 'https://') || ! $this->origins->accepts($settings->publicOrigin, $settings->publicOrigin)) {
            $problems[] = 'No fixed HTTPS address is configured for ngrok; a random address is never used.';
        }

        if ($this->authtokenReference($configuration) === null) {
            $problems[] = 'The ngrok authtoken is not stored for the journal.';
        }

        if (! is_dir($this->configFolder)) {
            $problems[] = "The journal's ngrok configuration folder does not exist.";
        }

        $version = $this->processes->newPendingProcess()->timeout(self::VERSION_SECONDS)->env(['HOME' => $this->configFolder])->run([$this->binary, 'version'])->output();

        if (! str_contains($version, $settings->executableVersion)) {
            $problems[] = "The ngrok program is not version {$settings->executableVersion}.";
        }

        return new GatewayReadiness($problems);
    }

    /**
     * @throws GatewayOpenFailed
     */
    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        $configuration = $operation->configuration;
        $settings = $configuration->settings;
        $reference = $this->authtokenReference($configuration);

        if ($reference === null || ! $this->origins->accepts($settings->publicOrigin, $settings->publicOrigin)) {
            throw GatewayOpenFailed::notReady(self::KEY);
        }

        $configFile = $this->writeConfiguration($this->secrets->read($reference));
        $upstream = "127.0.0.1:{$settings->listenerPort}";
        $child = $this->processes->newPendingProcess()->timeout(0)->env(['HOME' => $this->configFolder])
            ->start([$this->binary, 'http', $upstream, "--url={$settings->publicOrigin}", "--config={$configFile}", '--log=false']);

        return $this->launches->open(self::KEY, $operation, $child, fn () => $this->endpointFor($upstream, $settings->publicOrigin));
    }

    public function health(GatewayEndpoint $endpoint): GatewayHealth
    {
        return $this->probe->health($endpoint);
    }

    public function close(GatewayEndpoint $endpoint): void
    {
        $this->children->stop($endpoint->processReference);
    }

    /**
     * Whether the control API shows this launch's endpoint: confirmed when a tunnel forwards to the listener on the
     * configured origin, unexpected when one forwards to the listener on another address or claims the origin for
     * another upstream, and waiting while neither is there yet. Tunnels of other upstreams on other addresses are
     * ignored.
     */
    private function endpointFor(string $upstream, string $publicOrigin): GatewayAddressCheck
    {
        try {
            $tunnels = $this->http->timeout(2)->get("http://127.0.0.1:{$this->controlPort}/api/tunnels")->json('tunnels');
        } catch (ConnectionException) {
            return GatewayAddressCheck::Waiting;
        }

        foreach (is_array($tunnels) ? $tunnels : [] as $tunnel) {
            $address = is_array($tunnel) ? (string) ($tunnel['public_url'] ?? '') : '';
            $forwardsHere = is_array($tunnel) && self::isUpstream((string) ($tunnel['config']['addr'] ?? ''), $upstream);
            $claimsOrigin = $this->origins->accepts($address, $publicOrigin);

            if ($forwardsHere || $claimsOrigin) {
                return $forwardsHere && $claimsOrigin ? GatewayAddressCheck::Confirmed : GatewayAddressCheck::Unexpected;
            }
        }

        return GatewayAddressCheck::Waiting;
    }

    private static function isUpstream(string $address, string $upstream): bool
    {
        return in_array($address, [$upstream, "http://{$upstream}"], true);
    }

    /**
     * Writes the journal's own ngrok configuration and returns its path: the authtoken, the control API on loopback,
     * no inspection database and no log.
     */
    private function writeConfiguration(string $authtoken): string
    {
        $file = "{$this->configFolder}/ngrok.yml";
        $yaml = implode("\n", [
            'version: "2"',
            'authtoken: '.json_encode($authtoken),
            "web_addr: 127.0.0.1:{$this->controlPort}",
            'inspect_db_size: -1',
            'log: false',
            '',
        ]);
        file_put_contents($file, $yaml);
        chmod($file, 0600);

        return $file;
    }

    private function authtokenReference(GatewayConfiguration $configuration): string|null
    {
        foreach ($configuration->settings->secretReferences as $reference) {
            if ($this->secrets->has($reference)) {
                return $reference;
            }
        }

        return null;
    }
}
