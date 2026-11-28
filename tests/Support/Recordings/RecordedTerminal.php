<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Files\Contracts\Files;
use App\Navigation\Enums\NavigationKey;
use App\Recordings\CutExchange;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\Wire;
use App\Recordings\RecordedEvent;
use App\Recordings\Recordings;
use App\Terminals\KeyScripts\KeyScript;
use App\Values\FilePath;
use PHPUnit\Framework\Assert;

final readonly class RecordedTerminal
{
    private function __construct(public FilePath $folder, private CutExchange $exchange) {}

    public static function from(Recordings $recordings, string $driver): self
    {
        $scenario = 'terminal-turn';
        $recording = $recordings->scenario($driver, $scenario);

        foreach ($recording->exchangesOn(Wire::Driver) as $name) {
            $exchange = $recording->exchange($name);

            if ($exchange->isTerminal()) {
                return new self($recordings->folderOf($driver, $scenario)->child("exchanges/{$name}"), $exchange);
            }
        }

        Assert::fail("The {$driver} terminal turn recorded no terminal session.");
    }

    /** @return list<RecordedTurn> */
    public function turns(Files $files): array
    {
        $frames = $files->readJson($this->folder->child('frames.json'));
        $inputs = array_values(array_filter(
            $this->exchange->events,
            fn (RecordedEvent $event) => $event->type === RecordedEventType::Typed && ! $event->isSecret,
        ));
        $turns = [];

        foreach (array_chunk($inputs, 2) as $index => $pair) {
            Assert::assertCount(2, $pair, 'Each recorded message has a submit key.');
            [$typed, $submit] = $pair;
            Assert::assertSame(NavigationKey::Enter->bytes(), $submit->bytes);
            $before = $this->offsetOf($submit);
            $next = $inputs[($index + 1) * 2] ?? null;
            $after = $next === null ? PHP_INT_MAX : $this->offsetOf($next);
            $new = array_diff($this->rowsBefore($frames, $after), $this->rowsBefore($frames, $before));
            $answers = array_filter(
                $new,
                fn (string $row) => str_starts_with($row, '● ') || str_starts_with($row, '• '),
            );
            $answer = end($answers);
            Assert::assertIsString($answer, "The message submitted at {$before} has no recorded reply.");

            $message = str_starts_with($typed->bytes, KeyScript::PASTE_START)
                ? substr($typed->bytes, strlen(KeyScript::PASTE_START), -strlen(KeyScript::PASTE_END))
                : $typed->bytes;
            $turns[] = new RecordedTurn($message, $typed->bytes.$submit->bytes, $answer);
        }

        return $turns;
    }

    private function offsetOf(RecordedEvent $event): int
    {
        return ($event->at - $this->exchange->opening->openedAt) * 1000;
    }

    /**
     * @param  array<array{offset: int, frame: array{rows: list<string>}}>  $frames
     * @return list<string>
     */
    private function rowsBefore(array $frames, int $offset): array
    {
        $rows = [];

        foreach ($frames as $frame) {
            if ($frame['offset'] >= $offset) {
                break;
            }

            $rows = $frame['frame']['rows'];
        }

        return array_map(trim(...), $rows);
    }
}
