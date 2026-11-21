<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Bus\Support\RunningCommand;
use App\Hooks\Listeners\GiveRequestContainerToEvents;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Hooks\Octane\ContainerRecordingListener;
use Tests\TestCase;

/**
 * Under Octane each request runs in a sandbox of the application; a class listener the long-lived event dispatcher
 * builds must come from that sandbox, so it gets the request's scoped services, such as its running command.
 */
final class RequestContainerForEventsTest extends TestCase
{
    public function test_a_class_listener_gets_the_running_command_of_the_request_sandbox(): void
    {
        $events = $this->app->make(Dispatcher::class);
        $events->listen('octane.sandbox-check', ContainerRecordingListener::class);
        $workerCommand = $this->app->make(RunningCommand::class);
        $sandbox = clone $this->app;
        $sandbox->forgetScopedInstances();

        new GiveRequestContainerToEvents()->handle((object) ['sandbox' => $sandbox]);
        $events->dispatch('octane.sandbox-check');

        $this->assertSame($sandbox->make(RunningCommand::class), ContainerRecordingListener::$running);
        $this->assertNotSame($workerCommand, ContainerRecordingListener::$running);
    }
}
