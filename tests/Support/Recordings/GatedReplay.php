<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Recordings\CutExchange;
use App\Recordings\Enums\RecordedEventType;

/**
 * Plays a recorded terminal or pipe exchange by what is typed into it rather than by its clock, as the Go
 * recording.GatedReplay: what it printed before its first input comes at once, and each later group comes once an
 * input of the recorded kind is typed, the same key, or any text where text was typed.
 */
final class GatedReplay
{
    /**
     * The start of a terminal key's bytes: an escape sequence, such as an arrow or Esc.
     */
    private const string ESCAPE = "\e";

    /**
     * @var list<string>
     */
    private array $gates = [];

    /**
     * @var list<string>
     */
    private array $groups = [''];

    private int $opened = 0;

    public function __construct(CutExchange $exchange)
    {
        foreach ($exchange->events as $event) {
            if ($event->type === RecordedEventType::Typed) {
                $this->gates[] = $event->bytes;
                $this->groups[] = '';

                continue;
            }

            if ($event->type === RecordedEventType::Printed) {
                $this->groups[array_key_last($this->groups)] .= $event->bytes;
            }
        }
    }

    /**
     * What the exchange printed before anything was typed into it.
     */
    public function opening(): string
    {
        return $this->groups[0];
    }

    /**
     * What the exchange printed after this input, when it opens the next recorded gate; nothing when it does not.
     */
    public function type(string $bytes): string
    {
        $gate = $this->gates[$this->opened] ?? null;

        if ($gate === null || ! $this->opens($gate, $bytes)) {
            return '';
        }

        $this->opened++;

        return $this->groups[$this->opened];
    }

    /**
     * Whether every recorded input was typed.
     */
    public function isPlayedWhole(): bool
    {
        return $this->opened === count($this->gates);
    }

    private function opens(string $gate, string $typed): bool
    {
        return $this->isKey($gate) ? $gate === $typed : ! $this->isKey($typed);
    }

    private function isKey(string $bytes): bool
    {
        return str_starts_with($bytes, self::ESCAPE) || (strlen($bytes) === 1 && ctype_cntrl($bytes));
    }
}
