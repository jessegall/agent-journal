<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\SignInDriver;
use App\Agents\SignInEgress;
use App\Agents\Values\SecretHandover;
use Tests\TestCase;

/**
 * On a server every sign-in driver goes out through the allow-list proxy; on the Mac, with none set, its clean
 * environment stays as it was.
 */
final class SignInEgressTest extends TestCase
{
    private const array PROXY_VARIABLES = [
        'HTTPS_PROXY',
        'HTTP_PROXY',
        'https_proxy',
        'http_proxy',
        'NO_PROXY',
        'no_proxy',
    ];

    private string $folder = '';

    protected function setUp(): void
    {
        parent::setUp();

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

        $this->folder = sys_get_temp_dir().'/sign-in-egress-'.uniqid();
        mkdir($this->folder, 0o700);
        $driver = $this->folder.'/driver';
        file_put_contents($driver, "#!/bin/sh\nenv > \"\$HOME/environment\"\n");
        chmod($driver, 0o700);
        config(['accounts.claude_program' => $driver, 'accounts.codex_program' => $driver]);
    }

    protected function tearDown(): void
    {
        array_map(unlink(...), glob($this->folder.'/*') ?: []);
        rmdir($this->folder);

        parent::tearDown();
    }

    public function test_without_a_proxy_no_program_gets_a_proxy_variable(): void
    {
        $this->app->instance(SignInEgress::class, new SignInEgress(''));

        foreach ($this->environments() as $environment) {
            $this->assertSame([], array_intersect_key($environment, array_flip(self::PROXY_VARIABLES)));
        }
    }

    public function test_with_a_proxy_every_program_goes_out_through_it_and_reaches_the_app_directly(): void
    {
        $this->app->instance(SignInEgress::class, new SignInEgress('http://egress:3128'));

        foreach ($this->environments() as $environment) {
            $this->assertSame('http://egress:3128', $environment['HTTPS_PROXY'] ?? null);
            $this->assertSame('http://egress:3128', $environment['http_proxy'] ?? null);
            $this->assertSame('app', $environment['NO_PROXY'] ?? null);
            $this->assertSame('app', $environment['no_proxy'] ?? null);
        }
    }

    /**
     * The environment each driver was started with, as the fake driver wrote it.
     *
     * @return list<array<string, string>>
     */
    private function environments(): array
    {
        $this->program(DefaultDrivers::CLAUDE_CODE)->start([], $this->folder, SecretHandover::none())->finish();
        $claude = $this->readEnvironment();
        $this->program(DefaultDrivers::CODEX)->start([], $this->folder, SecretHandover::none())->finish();

        return [
            $claude,
            $this->readEnvironment(),
        ];
    }

    private function program(string $family): SignInDriver
    {
        return $this->journal->driverProfile($family)->signInDriver();
    }

    /**
     * @return array<string, string>
     */
    private function readEnvironment(): array
    {
        $variables = [];

        foreach (file($this->folder.'/environment', FILE_IGNORE_NEW_LINES) ?: [] as $line) {
            [$name, $value] = explode('=', $line, 2) + [1 => ''];
            $variables[$name] = $value;
        }

        return $variables;
    }
}
