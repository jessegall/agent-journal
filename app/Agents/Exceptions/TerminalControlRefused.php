<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\TerminalControlRefusal;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * Taking or using control of an agent's terminal was refused, and nothing reached its host.
 */
final class TerminalControlRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @param  array<string, int>  $facts
     */
    private function __construct(
        string $message,
        public readonly TerminalControlRefusal $refusal,
        private readonly array $facts = [],
    ) {
        parent::__construct($message);
    }

    public static function inspectOnly(): self
    {
        return new self('You may watch this terminal but not type into it.', TerminalControlRefusal::InspectOnly);
    }

    public static function watchOnly(): self
    {
        return new self(
            'This terminal is watch-only: its host does not take input from the browser.',
            TerminalControlRefusal::WatchOnly,
        );
    }

    public static function controlHeld(): self
    {
        return new self('Someone else has control of this terminal.', TerminalControlRefusal::ControlHeld);
    }

    public static function grantEnded(): self
    {
        return new self(
            'Your control of this terminal ended; take control again to type.',
            TerminalControlRefusal::GrantEnded,
        );
    }

    public static function unknownTake(): self
    {
        return new self('This control request is not known.', TerminalControlRefusal::UnknownTake);
    }

    public static function sequenceGap(int $expected): self
    {
        return new self(
            "This input is out of order; the next one expected is {$expected}.",
            TerminalControlRefusal::SequenceGap,
            ['expected' => $expected],
        );
    }

    public function refusalCode(): RefusalCode
    {
        return $this->refusal->code();
    }

    protected function status(): int
    {
        return $this->refusal->code()->status();
    }

    /**
     * @return array<string, int>
     */
    protected function details(): array
    {
        return $this->facts;
    }
}
