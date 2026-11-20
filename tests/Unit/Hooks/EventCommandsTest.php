<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Exceptions\TooManyEventCommands;
use App\Hooks\Values\EventCommands;
use App\Records\Commands\UnlinkRecords;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestActors;

final class EventCommandsTest extends TestCase
{
    public function test_commands_and_context_retain_order_and_a_message_adds_context_once(): void
    {
        $commands = array_map($this->command(...), range(1, 10));
        $original = EventCommands::of(...$commands);

        $result = $original->withContext('First')->withMessage('Wake')->withContext('Last');

        $this->assertSame($commands, $result->all());
        $this->assertSame(['First', 'Wake', 'Last'], $result->context);
        $this->assertSame(['Wake'], $result->messages);
        $this->assertSame([], $original->context);
        $this->assertSame([], $original->messages);
        $this->assertSame([], EventCommands::none()->all());
    }

    public function test_a_listener_cannot_return_more_than_ten_commands(): void
    {
        $commands = array_map($this->command(...), range(1, 11));

        $this->expectException(TooManyEventCommands::class);
        EventCommands::of(...$commands);
    }

    private function command(int $number): UnlinkRecords
    {
        return new UnlinkRecords(
            TestActors::record('tasks.task', $number),
            TestActors::record('tasks.task', $number + 100),
        );
    }
}
