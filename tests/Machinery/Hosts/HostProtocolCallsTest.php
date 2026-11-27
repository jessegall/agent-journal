<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The generated controllers of host protocol 1 read a host's call strictly: a field the protocol does not know, a
 * value it does not take, a query past its bounds and a body over its limit are each refused with a 422 naming them.
 */
final class HostProtocolCallsTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->enrollHost('Mac', [base_path()]);
    }

    public function test_a_body_with_a_field_the_protocol_does_not_know_is_refused_by_its_name(): void
    {
        $target = route('agents.host.heartbeat', absolute: false);
        $answer = $this->journal->hostCall($this->journal->hostCalled('Mac'), 'POST', $target, [
            'live_processes' => [],
            'mood' => 'sunny',
        ]);

        $this->journal->assertResult(
            [422, true],
            [$answer->getStatusCode(), str_contains((string) $answer->getContent(), 'mood')],
        );
    }

    public function test_a_value_the_protocol_does_not_take_is_refused_by_its_field(): void
    {
        $target = route('agents.host.processes.report', ['process' => 'p-1'], false);
        $answer = $this->journal->hostCall($this->journal->hostCalled('Mac'), 'POST', $target, [
            'process_id' => 'p-1',
            'report' => 'flying',
            'generation' => 1,
        ]);

        $this->journal->assertResult(
            [422, true],
            [$answer->getStatusCode(), str_contains((string) $answer->getContent(), 'report')],
        );
    }

    public function test_a_claim_that_waits_longer_than_the_protocol_takes_is_refused_by_its_field(): void
    {
        $target = route('agents.host.orders.claim', ['limit' => 1, 'wait' => 26], false);
        $answer = $this->journal->hostCall($this->journal->hostCalled('Mac'), 'POST', $target);

        $this->journal->assertResult(
            [422, true],
            [$answer->getStatusCode(), str_contains((string) $answer->getContent(), 'wait')],
        );
    }

    public function test_output_over_the_protocols_byte_limit_is_refused(): void
    {
        $chunk = ['stream' => 'stdout', 'offset' => 0, 'bytes' => str_repeat('a', 262_144)];
        $target = route('agents.host.processes.output', ['process' => 'p-1'], false);
        $answer = $this->journal->hostCall($this->journal->hostCalled('Mac'), 'POST', $target, [
            'chunks' => [$chunk],
        ]);

        $this->journal->assertResult(
            [422, true],
            [$answer->getStatusCode(), str_contains((string) $answer->getContent(), '262144 bytes')],
        );
    }
}
