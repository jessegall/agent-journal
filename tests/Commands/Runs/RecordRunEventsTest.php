<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\RecordRunEvents\RecordRunEventsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Runs\RunEventType;
use App\Values\PartKey;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The runner sends a batch of a run's events; a heartbeat in it keeps the run alive.
 */
final class RecordRunEventsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_heartbeat_keeps_the_run_alive(): void
    {
        $run = $this->journal->owner()->agent('Runner')->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');
        $run->forceFill(['heartbeat_at' => null])->save();

        $this->app->make(CommandBus::class)->run(new RecordRunEventsCommand(
            $run->id,
            json_encode(['events' => [['sequence' => 1, 'type' => RunEventType::Heartbeat->value]]], JSON_THROW_ON_ERROR),
        ));

        $this->assertNotNull($run->refresh()->heartbeat_at);
    }
}
