<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Events\Engine\EngineTicked;
use App\Exceptions\EngineAccessRefused;
use App\Support\EngineAccess;
use App\Support\EngineListenerSet;
use App\Support\EngineTickedDelivery;
use App\Support\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Engine\FailingEngineListener;
use Tests\Fixtures\Engine\RecordingEngineListener;
use Tests\TestCase;

/**
 * Every engine listener receives each pass's EngineTicked inside its own maintenance scope only; one that fails is logged
 * by its class and the next still receives it; the access is cleared after each.
 */
final class EngineTickedDeliveryTest extends TestCase
{
    public function test_every_listener_hears_the_event_in_its_own_scope_even_after_one_fails(): void
    {
        $first = $this->app->make(FailingEngineListener::class);
        $second = $this->app->make(RecordingEngineListener::class);
        $this->app->instance(FailingEngineListener::class, $first);
        $this->app->instance(RecordingEngineListener::class, $second);
        $listeners = new EngineListenerSet();
        $listeners->add(FailingEngineListener::class);
        $listeners->add(RecordingEngineListener::class);
        $this->app->instance(EngineListenerSet::class, $listeners);
        $log = Log::spy();
        $event = $this->ticked();

        $this->app->make(EngineTickedDelivery::class)->deliver($event);

        $this->assertSame(['fixtures.first'], $first->allowed);
        $this->assertSame(['fixtures.second'], $second->allowed);
        $this->assertSame([$event], $second->received);
        $log->shouldHaveReceived('error')->withArgs(
            fn (
                string $line,
                array $context,
            ) => $line === 'Engine listener failed' && $context['listener'] === FailingEngineListener::class,
        )->once();
        $this->expectException(EngineAccessRefused::class);
        $this->app->make(EngineAccess::class)->assertMaintenanceGranted('fixtures.second');
    }

    public function test_with_no_listeners_only_plain_observers_hear_it(): void
    {
        $this->app->instance(EngineListenerSet::class, new EngineListenerSet());
        Event::fake([EngineTicked::class]);
        $event = $this->ticked();

        $this->app->make(EngineTickedDelivery::class)->deliver($event);

        Event::assertDispatched(EngineTicked::class, fn (EngineTicked $received) => $received === $event);
    }

    private function ticked(): EngineTicked
    {
        return new EngineTicked(CarbonImmutable::parse('2026-11-18 12:00:00'), ElapsedTime::between(0, 1_000_000_000));
    }
}
