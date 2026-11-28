<?php

declare(strict_types=1);

namespace Tests\Unit\Support\Recordings;

use App\Support\Recordings\CutExchange;
use App\Support\Recordings\Enums\RecordedEventType;
use App\Support\Recordings\Enums\RecordingMode;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\RecordedEvent;
use App\Support\Recordings\Recordings;
use Tests\Support\Recordings\GatedReplay;
use Tests\TestCase;

/**
 * A real terminal turn of Claude Code plays by what is typed into it.
 */
final class GatedReplayTest extends TestCase
{
    public function test_a_terminal_turn_plays_its_output_as_its_inputs_are_typed(): void
    {
        $exchange = $this->terminalTurn();
        $replay = new GatedReplay($exchange);
        $typed = array_filter($exchange->events, fn (RecordedEvent $event) => $event->type === RecordedEventType::Typed);
        $printed = '';

        foreach ($typed as $event) {
            $printed .= $replay->type($event->bytes);
        }

        $this->assertNotSame('', $replay->opening());
        $this->assertNotSame('', $printed);
        $this->assertTrue($replay->isPlayedWhole());
    }

    public function test_an_input_of_another_kind_opens_nothing(): void
    {
        $replay = new GatedReplay($this->terminalTurn());

        $this->assertSame('', $replay->type("\e[A"));
        $this->assertFalse($replay->isPlayedWhole());
    }

    private function terminalTurn(): CutExchange
    {
        $recording = $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn');
        $exchanges = array_map($recording->exchange(...), $recording->exchangesOn(Wire::Driver));
        $terminal = array_find($exchanges, fn (CutExchange $exchange) => $exchange->opening->mode === RecordingMode::Terminal);
        $this->assertNotNull($terminal);

        return $terminal;
    }
}
