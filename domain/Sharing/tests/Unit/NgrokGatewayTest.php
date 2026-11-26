<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Unit;

use App\Support\GatewayConfiguration;
use App\Support\GatewayOperation;
use App\Support\GatewaySettings;
use Domain\Sharing\Exceptions\GatewayOpenFailed;
use Domain\Sharing\Support\Gateways\NgrokGateway;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Http\Client\Factory as HttpClient;
use Illuminate\Process\Factory as Processes;

/**
 * The ngrok gateway against fixture answers of its loopback control API: it accepts its own endpoint on the fixed
 * origin, ignores an unrelated one, and refuses a random ngrok address and an unexpected upstream; the setup check
 * refuses a missing fixed HTTPS address and a missing authtoken.
 */
final class NgrokGatewayTest extends TestCase
{
    private const string AUTH_TOKEN_LINE = 'authtoken: "fixture-token"';

    private const string WEB_ADDRESS_LINE = 'web_addr: 127.0.0.1:4041';

    private const string ORIGIN = 'https://docs.example.org';

    private string $folder;

    private Processes $processes;

    private HttpClient $http;

    protected function setUp(): void
    {
        parent::setUp();

        $this->folder = sys_get_temp_dir().'/ngrok-'.bin2hex(random_bytes(4));
        mkdir($this->folder.'/config', 0700, true);
        mkdir($this->folder.'/secrets', 0700, true);
        file_put_contents($this->folder.'/ngrok', "#!/bin/sh\n");
        chmod($this->folder.'/ngrok', 0755);
        file_put_contents($this->folder.'/secrets/ngrok-authtoken', "fixture-token\n");

        config([
            'sharing.ngrok.binary' => $this->folder.'/ngrok',
            'sharing.ngrok.config_dir' => $this->folder.'/config',
            'sharing.tunnels_dir' => $this->folder,
            'sharing.ngrok.control_port' => 4041,
            'sharing.secrets_dir' => $this->folder.'/secrets',
            'sharing.rate_limit_store' => 'array',
        ]);

        $this->processes = new Processes();

        $this->processes->fake(
            [
                '*version*' => 'ngrok version 3.20.0',
                '*http 127.0.0.1:8090*' => $this->processes->describe()->output('started')->iterations(1),
            ],
        );

        $this->app->instance(Processes::class, $this->processes);
        $this->http = new HttpClient();
        $this->app->instance(HttpClient::class, $this->http);
    }

    public function test_it_accepts_its_own_endpoint_and_ignores_an_unrelated_one(): void
    {
        $this->controlApiAnswers([
            ['public_url' => 'https://random-words.ngrok-free.app', 'config' => ['addr' => 'http://127.0.0.1:9999']],
            ['public_url' => self::ORIGIN, 'config' => ['addr' => 'http://127.0.0.1:8090']],
        ]);

        $endpoint = $this->gateway()->open($this->operation(self::ORIGIN));

        $this->assertSame(self::ORIGIN, $endpoint->publicOrigin);

        $this->assertStringContainsString(
            self::AUTH_TOKEN_LINE,
            (string) file_get_contents($this->folder.'/config/ngrok.yml'),
        );

        $this->assertStringContainsString(
            self::WEB_ADDRESS_LINE,
            (string) file_get_contents($this->folder.'/config/ngrok.yml'),
        );
    }

    public function test_a_random_ngrok_address_and_an_unexpected_upstream_are_refused(): void
    {
        $this->controlApiAnswers(
            [['public_url' => 'https://random-words.ngrok-free.app', 'config' => ['addr' => 'http://127.0.0.1:8090']]],
        );

        $this->assertThrows(
            fn () => $this->gateway()->open($this->operation(self::ORIGIN)),
            GatewayOpenFailed::class,
            GatewayOpenFailed::unexpectedAddress('ngrok')->getMessage(),
        );

        $this->controlApiAnswers([['public_url' => self::ORIGIN, 'config' => ['addr' => 'http://127.0.0.1:3000']]]);

        $this->assertThrows(
            fn () => $this->gateway()->open($this->operation(self::ORIGIN)),
            GatewayOpenFailed::class,
            GatewayOpenFailed::unexpectedAddress('ngrok')->getMessage(),
        );
    }

    public function test_the_setup_check_refuses_a_missing_fixed_address_and_authtoken(): void
    {
        $this->assertTrue($this->gateway()->setupCheck($this->operation(self::ORIGIN)->configuration)->isComplete());

        unlink($this->folder.'/secrets/ngrok-authtoken');

        $this->assertSame([
            'No fixed HTTPS address is configured for ngrok; a random address is never used.',
            'The ngrok authtoken is not stored for the journal.',
        ], $this->gateway()->setupCheck($this->operation('http://docs.example.org')->configuration)->problems);
    }

    /**
     * @param  list<array<string, mixed>>  $tunnels
     */
    private function controlApiAnswers(array $tunnels): void
    {
        $this->http = new HttpClient();
        $this->http->fake(['http://127.0.0.1:4041/api/tunnels' => $this->http->response(['tunnels' => $tunnels])]);
        $this->app->instance(HttpClient::class, $this->http);
    }

    private function gateway(): NgrokGateway
    {
        return $this->app->make(NgrokGateway::class);
    }

    private function operation(string $origin): GatewayOperation
    {
        return new GatewayOperation(
            'operation-1',
            'run-1',
            1,
            'lease',
            time() + 90,
            new GatewayConfiguration(
                'configuration-1',
                1,
                new GatewaySettings('ngrok', '3.20.0', 'ngrok.com', $origin, 8090, ['ngrok-authtoken']),
            ),
        );
    }
}
