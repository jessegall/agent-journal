<?php

declare(strict_types=1);

namespace App\Support\Gateways\Tunler;

use App\Attributes\Rules\OutsideThePlaces;
use App\Contracts\Files\Files;
use App\Contracts\Sharing\ShareGateway;
use App\Enums\Files\Place;
use App\Enums\Files\PlaceExemption;
use App\Enums\Sharing\GatewayAddressCheck;
use App\Exceptions\GatewayOpenFailed;
use App\Exceptions\TunlerStatusUnreadable;
use App\Support\GatewayConfiguration;
use App\Support\GatewayEndpoint;
use App\Support\GatewayHealth;
use App\Support\GatewayOperation;
use App\Support\Gateways\Support\ChallengeProbe;
use App\Support\Gateways\Support\GatewayChildren;
use App\Support\Gateways\Support\GatewayStarts;
use App\Support\Gateways\Support\PublicOriginCheck;
use App\Support\GatewaySetupCheck;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Process\Factory as Processes;

/**
 * The Tunler gateway: the pinned tunler program run with the journal's own configuration folder, opened as
 * tunler <port> --domain=<subdomain> --inspect=0, its address taken only from that start's own "tunnel up" line and
 * accepted only as the configured HTTPS origin. It never repeats a line the program printed.
 */
final readonly class TunlerGateway implements ShareGateway
{
    public const string KEY = 'tunler';

    private const int STATUS_SECONDS = 10;

    private const string CONNECTED_PREFIX = 'tunnel up: ';

    public function __construct(
        private Processes $processes,
        private GatewayChildren $children,
        private GatewayStarts $starts,
        private PublicOriginCheck $origins,
        private ChallengeProbe $probe,
        #[Config('sharing.tunler.binary')]
        private string $binary,
        #[Config('sharing.tunler.config_dir')]
        private string $configFolder,
        #[Config('sharing.tunler.subdomain')]
        private string|null $subdomain,
        private Files $files,
    ) {}

    #[OutsideThePlaces(PlaceExemption::GatewayBinary)]
    public function setupCheck(GatewayConfiguration $configuration): GatewaySetupCheck
    {
        if (! is_file($this->binary) || ! is_executable($this->binary)) {
            return new GatewaySetupCheck(['The tunler program is not installed at its pinned path.']);
        }

        $problems = [];

        if (! $this->files->isFolder($this->files->pathIn(Place::SharingTunnels, $this->configFolder))) {
            $problems[] = "The journal's tunler configuration folder does not exist.";
        }

        if ($this->subdomain === null || $this->subdomain === '') {
            $problems[] = 'No subdomain is set for Tunler (journal.tunnels.tunler.subdomain).';
        }

        if (! str_contains($this->run(['version']), $configuration->settings->executableVersion)) {
            $problems[] = "The tunler program is not version {$configuration->settings->executableVersion}.";
        }

        try {
            $status = TunlerStatus::fromOutput($this->run([
                'status',
                '--json',
            ]));
        } catch (TunlerStatusUnreadable) {
            return new GatewaySetupCheck([
                ...$problems,
                'Tunler did not report its login status.',
            ]);
        }

        if (! $status->isLoggedIn) {
            $problems[] = 'The journal is not logged in to Tunler.';
        }

        if ($status->host !== $configuration->settings->providerHost) {
            $problems[] = "Tunler is logged in to another host than {$configuration->settings->providerHost}.";
        }

        return new GatewaySetupCheck($problems);
    }

    /**
     * @throws GatewayOpenFailed
     */
    public function open(GatewayOperation $operation): GatewayEndpoint
    {
        $settings = $operation->settings();

        if ($this->subdomain === null || $this->subdomain === '') {
            throw GatewayOpenFailed::notReady(self::KEY);
        }

        $child = $this->processes->newPendingProcess()->env($this->environment())->timeout(0)
            ->start([
                $this->binary,
                (string) $settings->listenerPort,
                "--domain={$this->subdomain}",
                '--inspect=0',
            ]);

        return $this->starts->open(
            self::KEY,
            $operation,
            $child,
            fn (InvokedProcess $started) => $this->lookAt(
                $started->latestOutput(),
                $settings->publicOrigin,
                $settings->providerHost,
            ),
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
     * What the start's newest output says: nothing yet, the configured origin, or another address.
     */
    private function lookAt(string $output, string $publicOrigin, string $providerHost): GatewayAddressCheck
    {
        $address = $this->addressIn($output);

        if ($address === null) {
            return GatewayAddressCheck::Waiting;
        }

        if ($this->isExpectedOrigin(
            $address,
            $publicOrigin,
            $providerHost,
        )) {
            return GatewayAddressCheck::Confirmed;
        }

        return GatewayAddressCheck::Unexpected;
    }

    /**
     * The address of the newest "tunnel up" line in the start's own output, without the rest of the line.
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
        return $this->origins->accepts(
            $address,
            $publicOrigin,
        ) && parse_url($address, PHP_URL_HOST) === "{$this->subdomain}.{$providerHost}";
    }

    /**
     * @param  list<string>  $arguments
     */
    private function run(array $arguments): string
    {
        return $this->processes->newPendingProcess()->env($this->environment())->timeout(self::STATUS_SECONDS)->run(
            [
                $this->binary,
                ...$arguments,
            ],
        )->output();
    }

    /**
     * The journal's own configuration folder for tunler, instead of any user's.
     *
     * @return array<string, string>
     */
    private function environment(): array
    {
        return [
            'XDG_CONFIG_HOME' => $this->configFolder,
            'HOME' => $this->configFolder,
        ];
    }
}
