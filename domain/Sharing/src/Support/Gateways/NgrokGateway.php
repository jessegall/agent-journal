<?php

declare(strict_types=1);

namespace Domain\Sharing\Support\Gateways;

use App\Attributes\Rules\OutsideThePlaces;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Enums\PlaceExemption;
use Domain\Sharing\Contracts\ShareGateway;
use Domain\Sharing\Enums\GatewayAddressCheck;
use Domain\Sharing\Exceptions\GatewayOpenFailed;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Factory as HttpClient;
use Illuminate\Process\Factory as Processes;
use Illuminate\Support\Arr;

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
        private GatewayStarts $starts,
        private GatewaySecrets $secrets,
        private PublicOriginCheck $origins,
        private ChallengeProbe $probe,
        #[Config('sharing.ngrok.binary')]
        private string $binary,
        #[Config('sharing.ngrok.config_dir')]
        private string $configFolder,
        #[Config('sharing.ngrok.control_port')]
        private int $controlPort,
        private Files $files,
    ) {}

    #[OutsideThePlaces(PlaceExemption::GatewayBinary)]
    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck
    {
        if (! is_file($this->binary) || ! is_executable($this->binary)) {
            return new GatewaySetupCheck(['The ngrok program is not installed at its pinned path.']);
        }

        $settings = $configuration->settings;
        $problems = [];

        if (! str_starts_with($settings->publicOrigin, 'https://')
            || ! $this->origins->accepts($settings->publicOrigin, $settings->publicOrigin)) {
            $problems[] = 'No fixed HTTPS address is configured for ngrok; a random address is never used.';
        }

        if ($this->authtokenReference($configuration) === null) {
            $problems[] = 'The ngrok authtoken is not stored for the journal.';
        }

        if (! $this->files->isFolder($this->files->pathIn(Place::SharingTunnels, $this->configFolder))) {
            $problems[] = "The journal's ngrok configuration folder does not exist.";
        }

        $version = $this->processes->newPendingProcess()->timeout(self::VERSION_SECONDS)->env(
            ['HOME' => $this->configFolder],
        )->run([$this->binary, 'version'])->output();

        if (! str_contains($version, $settings->executableVersion)) {
            $problems[] = "The ngrok program is not version {$settings->executableVersion}.";
        }

        return new GatewaySetupCheck($problems);
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
            ->start(
                [
                    $this->binary,
                    'http',
                    $upstream,
                    "--url={$settings->publicOrigin}",
                    "--config={$configFile}",
                    '--log=false',
                ],
            );

        return $this->starts->open(
            self::KEY,
            $operation,
            $child,
            fn () => $this->endpointFor($upstream, $settings->publicOrigin),
        );
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
     * Whether the control API shows this start's endpoint: confirmed when a tunnel forwards to the listener on the
     * configured origin, unexpected when one forwards to the listener on another address or claims the origin for
     * another upstream, and waiting while neither is there yet. Tunnels of other upstreams on other addresses are
     * ignored.
     */
    private function endpointFor(string $upstream, string $publicOrigin): GatewayAddressCheck
    {
        try {
            $tunnels = $this->http->timeout(2)->get(
                "http://127.0.0.1:{$this->controlPort}/api/tunnels",
            )->collect('tunnels');
        } catch (ConnectionException) {
            return GatewayAddressCheck::Waiting;
        }

        foreach ($tunnels as $tunnel) {
            $forwardsHere = self::isUpstream(Arr::string($tunnel, 'config.addr'), $upstream);
            $claimsOrigin = $this->origins->accepts(Arr::string($tunnel, 'public_url'), $publicOrigin);

            if ($forwardsHere || $claimsOrigin) {
                if ($forwardsHere
                    && $claimsOrigin) {
                    return GatewayAddressCheck::Confirmed;
                }

                return GatewayAddressCheck::Unexpected;
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
        $file = $this->files->pathIn(Place::SharingTunnels, $this->configFolder)->child('ngrok.yml');
        $quotedAuthtoken = json_encode($authtoken, JSON_THROW_ON_ERROR);

        $this->files->write($file, <<<YAML
            version: "2"
            authtoken: {$quotedAuthtoken}
            web_addr: 127.0.0.1:{$this->controlPort}
            inspect_db_size: -1
            log: false

            YAML, Permissions::OwnerOnly);

        return $this->files->realPath($file);
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
