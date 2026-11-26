<?php

declare(strict_types=1);

namespace Tests\Unit\Hosts;

use App\Enums\Hosts\HostOrderType;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;
use Tests\TestCase;

/**
 * An order is signed over its id, number, type, process, the SHA-256 of its payload and its expiry, keyed by the
 * host's order secret: the same lines the host checks.
 */
final class HostOrderSignatureTest extends TestCase
{
    private const string SIGNATURE = 'cc55054280b01d6115d7cf90a9f2ff3e9be711a0787a7d5cbbeb90683ace968d';

    public function test_a_fixed_order_has_the_fixed_signature(): void
    {
        $this->assertSame(self::SIGNATURE, $this->host('the-order-secret')->signOrder($this->order()));
    }

    public function test_another_secret_or_payload_signs_differently(): void
    {
        $altered = $this->order();
        $altered->payload = ['bytes' => 'aGk=', 'as_user' => false];

        $this->assertNotSame(self::SIGNATURE, $this->host('another-secret')->signOrder($this->order()));
        $this->assertNotSame(self::SIGNATURE, $this->host('the-order-secret')->signOrder($altered));
    }

    private function host(string $secret): Host
    {
        $host = new Host();
        $host->order_secret = $secret;

        return $host;
    }

    private function order(): HostOrder
    {
        $order = new HostOrder();
        $order->id = '01jorder0000000000000000001';
        $order->sequence = 7;
        $order->type = HostOrderType::WriteKeys;
        $order->host_process_id = '01jprocess000000000000000001';
        $order->payload = ['bytes' => 'aGk=', 'as_user' => true];
        $order->expires_at = CarbonImmutable::parse('2026-11-26T11:00:05+01:00');

        return $order;
    }
}
