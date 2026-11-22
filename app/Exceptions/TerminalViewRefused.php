<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Enums\TerminalViewRefusal;
use App\Models\TerminalView;
use Carbon\CarbonInterface;
use RuntimeException;
use Throwable;

/**
 * A terminal view refused: before it is opened, so no view is stored, or a renewal or read of a view that is unknown
 * or ended, which changes nothing.
 */
final class TerminalViewRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private function __construct(
        string $message,
        public readonly TerminalViewRefusal $refusal,
        Throwable|null $previous = null,
    ) {
        parent::__construct($message, previous: $previous);
    }

    /**
     * An unknown agent and an agent the viewer may not inspect get this same answer, which says nothing of whether the
     * agent runs.
     */
    public static function mayNotInspect(Throwable|null $previous = null): self
    {
        return new self('You may not inspect this agent', TerminalViewRefusal::MayNotInspect, $previous);
    }

    public static function processDriver(): self
    {
        return new self(
            'This driver has no terminal; there is nothing to watch.',
            TerminalViewRefusal::ProcessDriver,
        );
    }

    public static function notRunning(CarbonInterface $endedAt): self
    {
        return new self(
            "This agent is not running; its terminal ended at {$endedAt->format('H:i')}.",
            TerminalViewRefusal::NotRunning,
        );
    }

    public static function tooManyViews(): self
    {
        return new self(
            'You may have at most '.TerminalView::MAX_PER_VIEWER.' terminal views open; close one first.',
            TerminalViewRefusal::TooManyViews,
        );
    }

    public static function unsupportedInterval(int $ms): self
    {
        return new self(
            "A terminal view refreshes every 500 or 1000 ms, not every {$ms} ms.",
            TerminalViewRefusal::UnsupportedInterval,
        );
    }

    /**
     * An id that names none of the viewer's views of this agent gets this answer, which says nothing of other viewers.
     */
    public static function unknownInterest(): self
    {
        return new self(
            'This terminal view is not open; open the terminal again.',
            TerminalViewRefusal::UnknownInterest,
        );
    }

    public static function interestEnded(): self
    {
        return new self(
            'This terminal view was closed or ran out; open the terminal again.',
            TerminalViewRefusal::InterestEnded,
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
}
