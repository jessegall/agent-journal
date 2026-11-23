<?php

declare(strict_types=1);

namespace Tests\Unit\Connections;

use App\Support\ServerOrigin;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Task 2742: install lines name an https origin; plain http only while the app runs locally, and only for this
 * machine or a private network address, so a folder on the same Mac or network can be connected for a test.
 */
final class ServerOriginTest extends TestCase
{
    /**
     * @return array<string, array{string, bool, bool}>
     */
    public static function origins(): array
    {
        return [
            'https on a server' => ['https://journal.example.com', false, true],
            'http on a server' => ['http://journal.example.com', false, false],
            'http to localhost on a server' => ['http://localhost:54700', false, false],
            'http to localhost locally' => ['http://localhost:54700', true, true],
            'http to a loopback address locally' => ['http://127.0.0.1:54700', true, true],
            'http to a private address locally' => ['http://192.168.1.20:54700', true, true],
            'http to a public address locally' => ['http://93.184.216.34', true, false],
            'http to a public name locally' => ['http://journal.example.com', true, false],
        ];
    }

    #[DataProvider('origins')]
    public function test_an_origin_is_usable_only_on_its_terms(string $configured, bool $runsLocally, bool $usable): void
    {
        $this->assertSame($usable, new ServerOrigin($configured, $runsLocally)->isUsable());
    }

    public function test_a_local_http_origin_keeps_its_scheme_and_port(): void
    {
        $this->assertSame('http://localhost:54700', new ServerOrigin('http://localhost:54700/x', true)->canonical());
        $this->assertSame('https://journal.example.com', new ServerOrigin('https://journal.example.com')->canonical());
    }
}
