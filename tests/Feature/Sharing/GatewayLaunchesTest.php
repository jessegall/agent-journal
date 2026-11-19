<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Sharing\Enums\GatewayAddressCheck;
use App\Sharing\Exceptions\GatewayOpenFailed;
use App\Sharing\Gateways\Support\GatewayChildren;
use App\Sharing\Gateways\Support\GatewayLaunches;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewayOperation;
use Illuminate\Process\Factory as Processes;
use Illuminate\Process\FakeInvokedProcess;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\TestCase;

/**
 * The one launch every gateway opens through: a confirmed address keeps the program for the run under its endpoint
 * reference, another address stops it and refuses, no address before it exits refuses without signalling the exited
 * program, and closing the reference ends the program it keeps.
 */
final class GatewayLaunchesTest extends TestCase
{
    private Processes $processes;

    protected function setUp(): void
    {
        parent::setUp();

        $this->processes = $this->app->make(Processes::class);
        $this->processes->fake(['*' => $this->processes->describe()->output('starting')->iterations(2)]);
    }

    public function test_a_confirmed_address_keeps_the_program_and_closing_it_ends_it(): void
    {
        $child = $this->start();
        $looks = 0;

        $endpoint = $this->app->make(
            GatewayLaunches::class,
        )->open('fake', $this->operation(), $child, function () use (&$looks): GatewayAddressCheck {
            return ++$looks < 2 ? GatewayAddressCheck::Waiting : GatewayAddressCheck::Confirmed;
        });

        $this->assertSame(
            ['run-1:3', FakeShareGateway::PUBLIC_ORIGIN],
            [$endpoint->processReference, $endpoint->publicOrigin],
        );
        $this->assertFalse($child->hasReceivedSignal(15));

        $this->app->make(GatewayChildren::class)->stop('run-1:3');

        $this->assertTrue($child->hasReceivedSignal(15));
    }

    public function test_another_address_stops_the_program_and_refuses(): void
    {
        $child = $this->start();

        $this->assertThrows(
            fn () => $this->app->make(GatewayLaunches::class)->open('fake', $this->operation(), $child, fn () => GatewayAddressCheck::Unexpected),
            GatewayOpenFailed::class,
            'other than its fixed public origin',
        );
        $this->assertTrue($child->hasReceivedSignal(15));
    }

    public function test_no_address_before_the_program_exits_refuses_and_signals_nothing_that_exited(): void
    {
        $child = $this->start();

        $this->assertThrows(
            fn () => $this->app->make(GatewayLaunches::class)->open('fake', $this->operation(), $child, fn () => GatewayAddressCheck::Waiting),
            GatewayOpenFailed::class,
            'no public address',
        );
        $this->assertFalse($child->hasReceivedSignal(15));
    }

    private function start(): FakeInvokedProcess
    {
        $child = $this->processes->newPendingProcess()->start(['fake-gateway']);
        $this->assertInstanceOf(FakeInvokedProcess::class, $child);

        return $child;
    }

    private function operation(): GatewayOperation
    {
        return new GatewayOperation(
            'operation-1',
            'run-1',
            3,
            str_repeat('a', 64),
            time() + 90,
            new GatewayConfiguration('configuration-1', 1, FakeShareGateway::settings()),
        );
    }
}
