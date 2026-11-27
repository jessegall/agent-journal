<?php

declare(strict_types=1);

namespace Tests\Unit\Sharing;

use App\Sharing\Exceptions\GatewayOpenFailed;
use App\Sharing\Support\Gateways\GatewayConfiguration;
use App\Sharing\Support\Gateways\GatewayEndpoint;
use App\Sharing\Support\Gateways\GatewayOperation;
use App\Sharing\Support\Gateways\GatewaySettings;
use App\Sharing\Support\Gateways\TunlerGateway;
use App\Sharing\Support\PublicAddresses;
use Illuminate\Http\Client\Factory as HttpClient;
use Illuminate\Http\Client\Request;
use Illuminate\Process\Factory as Processes;
use Tests\Commands\Sharing\SharingTestCase;

/**
 * The Tunler gateway against fixture outputs of the tunler program, with no real account: the setup check names each
 * missing piece, opening accepts only the configured HTTPS origin from the start's own line, and the probe accepts
 * only its own challenge without a redirect.
 */
final class TunlerGatewayTest extends SharingTestCase
{
    private const string ORIGIN = 'https://docs.example.test';

    private string $folder;

    private Processes $processes;

    private HttpClient $http;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/tunler-'.bin2hex(random_bytes(4));
        mkdir($this->folder.'/config', 0700, true);
        file_put_contents($this->folder.'/tunler', "#!/bin/sh\n");
        chmod($this->folder.'/tunler', 0755);

        config([
            'journal.sharing.tunler.binary' => $this->folder.'/tunler',
            'journal.sharing.tunler.config_dir' => $this->folder.'/config',
            'journal.sharing.tunnels_dir' => $this->folder,
            'journal.sharing.tunler.subdomain' => 'docs',
            'journal.sharing.rate_limit_store' => 'array',
        ]);

        $this->processes = new Processes();
        $this->app->instance(Processes::class, $this->processes);
        $this->http = new HttpClient();
        $this->app->instance(HttpClient::class, $this->http);

        $this->app->instance(PublicAddresses::class, new class extends PublicAddresses
        {
            public function isPublic(string $host): bool
            {
                return $host === 'docs.example.test';
            }
        });
    }

    public function test_the_setup_check_names_each_missing_piece_and_passes_when_all_are_there(): void
    {
        $this->processes->fake(
            [
                '*version*' => 'tunler 1.4.0',
                '*status*' => '{"logged_in": true, "auth_ok": true, "host": "example.test"}',
            ],
        );

        $this->assertTrue($this->gateway()->setupCheck($this->configuration())->isComplete());

        $this->processes->fake(
            ['*version*' => 'tunler 1.3.9', '*status*' => '{"logged_in": false, "host": "other.test"}'],
        );

        config(['journal.sharing.tunler.subdomain' => null]);

        $this->assertSame([
            'No subdomain is set for Tunler (journal.tunnels.tunler.subdomain).',
            'The tunler program is not version 1.4.0.',
            'The journal is not logged in to Tunler.',
            'Tunler is logged in to another host than example.test.',
        ], $this->gateway()->setupCheck($this->configuration())->problems);

        config(['journal.sharing.tunler.binary' => $this->folder.'/missing']);

        $this->assertSame(
            ['The tunler program is not installed at its pinned path.'],
            $this->gateway()->setupCheck($this->configuration())->problems,
        );
    }

    public function test_opening_accepts_the_configured_origin_from_the_start_line(): void
    {
        $this->processes->fake(
            [
                '*--domain=docs*' => $this->processes->describe()->output('connecting')->output(
                    'tunnel up: '.self::ORIGIN.' -> localhost:8090',
                )->iterations(2),
            ],
        );

        $endpoint = $this->gateway()->open($this->operation());

        $this->assertSame([self::ORIGIN, 'run-1:1'], [$endpoint->publicOrigin, $endpoint->processReference]);

        $this->processes->assertRan(
            fn ($process) => str_contains(implode(' ', (array) $process->command), '8090 --domain=docs --inspect=0'),
        );
    }

    public function test_opening_refuses_another_host_and_plain_http(): void
    {
        foreach ([
            'https://evil.example.test',
            'http://docs.example.test',
            'https://docs.example.test:8443',
        ] as $address) {
            $this->processes->fake(
                [
                    '*--domain=docs*' => $this->processes->describe()->output(
                        "tunnel up: {$address} -> localhost:8090",
                    )->iterations(1),
                ],
            );

            $this->assertThrows(
                fn () => $this->gateway()->open($this->operation()),
                GatewayOpenFailed::class,
                GatewayOpenFailed::unexpectedAddress('tunler')->getMessage(),
            );
        }
    }

    public function test_the_probe_accepts_its_own_challenge_and_refuses_a_redirect(): void
    {
        $endpoint = new GatewayEndpoint('run-1', 1, self::ORIGIN, 'run-1:1');
        $this->http->fake(fn (Request $request) => $this->http->response((string) basename($request->url())));

        $this->assertTrue($this->gateway()->health($endpoint)->isHealthy());

        $this->http = new HttpClient();
        $this->http->fake(fn () => $this->http->response('', 302, ['Location' => 'https://elsewhere.test/']));
        $this->app->instance(HttpClient::class, $this->http);

        $this->assertSame(['The public origin redirected the probe.'], $this->gateway()->health($endpoint)->problems);

        $this->assertFalse(
            $this->gateway()->health(
                new GatewayEndpoint('run-1', 1, 'http://docs.example.test', 'run-1:1'),
            )->isHealthy(),
        );
    }

    private function gateway(): TunlerGateway
    {
        return $this->app->make(TunlerGateway::class);
    }

    private function configuration(): GatewayConfiguration
    {
        return new GatewayConfiguration(
            'configuration-1',
            1,
            new GatewaySettings('tunler', '1.4.0', 'example.test', self::ORIGIN, 8090, []),
        );
    }

    private function operation(): GatewayOperation
    {
        return new GatewayOperation('operation-1', 'run-1', 1, 'lease', time() + 90, $this->configuration());
    }
}
