<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Tunler;

use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Exceptions\GatewayOpenFailed;
use App\Sharing\Gateways\Support\ChallengeProbe;
use App\Sharing\Gateways\Support\GatewayChildren;
use App\Sharing\Gateways\Support\PublicOriginCheck;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayHealth;
use App\Sharing\Support\GatewayOperation;
use App\Sharing\Support\GatewayReadiness;
use Illuminate\Container\Attributes\Config;
use Illuminate\Process\Factory as Processes;
use JsonException;

/**
 * The Tunler gateway: the pinned tunler program run with the journal's own configuration folder, opened as
 * tunler <port> --domain=<subdomain> --inspect=0, its address taken only from that launch's own "tunnel up" line and
 * accepted only as the configured HTTPS origin. It never repeats a line the program printed.
 */
final readonly class TunlerGateway implements ShareGateway
{
    public const string KEY = 'tunler';

    private const int STATUS_SECONDS = 10;

    private const int CONNECT_SECONDS = 60;

    private const string CONNECTED_PREFIX = 'tunnel up: ';

    public function __construct(
        private Processes $processes,
        private GatewayChildren $children,
        private PublicOriginCheck $origins,
        private ChallengeProbe $probe,
        #[Config('sharing.tunler.binary')] private string $binary,
        #[Config('sharing.tunler.config_dir')] private string $configFolder,
        #[Config('sharing.tunler.subdomain')] private string|null $subdomain,
    ) {}

    public function readiness(GatewayConfiguration $configuration): GatewayReadiness
    {
        if (! is_file($this->binary) || ! is_executable($this->binary)) {
            return new GatewayReadiness(['The tunler program is not installed at its pinned path.']);
        }

        $problems = [];

        if (! is_dir($this->configFolder)) {
            $problems[] = "The journal's tunler configuration folder does not exist.";
        }

        if ($this->subdomain === null || $this->subdomain === '') {
            $problems[] = 'No subdomain is set for Tunler (journal.tunnels.tunler.subdomain).';
        }

        if (! str_contains($this->run(['version']), $configuration->settings->executableVersion)) {
            $problems[] = "The tunler program is not version {$configuration->settings->executableVersion}.";
        }

        $status = $this->status();

        if (($status['logged_in'] ?? false) !== true || ($status['auth_ok'] ?? false) !== true) {
            $problems[] = 'The journal is not logged in to Tunler.';
        }

        if (($status['host'] ?? null) !== $configuration->settings->providerHost) {
            $problems[] = "Tunler is logged in to another host than {$configuration->settings->providerHost}.";
        }

        return new GatewayReadiness($problems);
    }

    /**
     * @throws GatewayOpenFailed
     */
    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        $settings = $operation->configuration->settings;

        if ($this->subdomain === null || $this->subdomain === '') {
            throw GatewayOpenFailed::notReady(self::KEY);
        }

        $child = $this->processes->env($this->environment())->timeout(0)
            ->start([$this->binary, (string) $settings->listenerPort, "--domain={$this->subdomain}", '--inspect=0']);
        $address = null;
        $deadline = time() + self::CONNECT_SECONDS;

        while ($address === null && $child->running() && time() < $deadline) {
            $address = $this->addressIn($child->latestOutput());
            usleep(200_000);
        }

        $address ??= $this->addressIn($child->latestOutput());

        if ($address === null) {
            $child->stop();

            throw GatewayOpenFailed::noAddressInTime(self::KEY, self::CONNECT_SECONDS);
        }

        if (! $this->isExpectedOrigin($address, $settings->publicOrigin, $settings->providerHost)) {
            $child->stop();

            throw GatewayOpenFailed::unexpectedAddress(self::KEY);
        }

        $reference = "{$operation->runId}:{$operation->endpointVersion}";
        $this->children->keep($reference, $child);

        return new GatewayEndpoint($operation->runId, $operation->endpointVersion, $settings->publicOrigin, $reference);
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
     * The address of the newest "tunnel up" line in the launch's own output, without the rest of the line.
     */
    private function addressIn(string $output): string|null
    {
        $address = null;

        foreach (explode("\n", $output) as $line) {
            $at = strpos($line, self::CONNECTED_PREFIX);

            if ($at !== false) {
                $address = strtok(substr($line, $at + strlen(self::CONNECTED_PREFIX)), ' ') ?: null;
            }
        }

        return $address;
    }

    /**
     * Only the configured origin, on the exact subdomain of the provider host.
     */
    private function isExpectedOrigin(string $address, string $publicOrigin, string $providerHost): bool
    {
        return $this->origins->accepts($address, $publicOrigin) && parse_url($address, PHP_URL_HOST) === "{$this->subdomain}.{$providerHost}";
    }

    /**
     * @return array<string, mixed>
     */
    private function status(): array
    {
        try {
            $status = json_decode($this->run(['status', '--json']), true, 4, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return [];
        }

        return is_array($status) ? $status : [];
    }

    /**
     * @param  list<string>  $arguments
     */
    private function run(array $arguments): string
    {
        return $this->processes->env($this->environment())->timeout(self::STATUS_SECONDS)->run([$this->binary, ...$arguments])->output();
    }

    /**
     * The journal's own configuration folder for tunler, instead of any user's.
     *
     * @return array<string, string>
     */
    private function environment(): array
    {
        return ['XDG_CONFIG_HOME' => $this->configFolder, 'HOME' => $this->configFolder];
    }
}
