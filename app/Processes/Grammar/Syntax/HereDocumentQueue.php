<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax;

use App\Values\WaitingHereDocument;

/**
 * The here-documents of one line in the order their operators appear: an operator waits for its delimiter word, then
 * the document waits for its body, which the lexer reads after the line ends.
 */
final class HereDocumentQueue
{
    /**
     * @var list<WaitingHereDocument>
     */
    private array $waiting = [];

    /**
     * Set while an operator waits for its delimiter word: whether that document strips leading tabs.
     */
    private bool|null $delimiterStripsTabs = null;

    public function expectDelimiter(bool $stripsTabs): void
    {
        $this->delimiterStripsTabs = $stripsTabs;
    }

    /**
     * Takes the word just read as the delimiter of the operator waiting for one, if any.
     */
    public function takeDelimiter(int $redirectIndex): void
    {
        if ($this->delimiterStripsTabs === null) {
            return;
        }

        $this->waiting[] = new WaitingHereDocument($redirectIndex, $this->delimiterStripsTabs);
        $this->delimiterStripsTabs = null;
    }

    public function hasWaiting(): bool
    {
        return $this->waiting !== [];
    }

    /**
     * Every document waiting for its body, in order; the queue is empty afterwards.
     *
     * @return list<WaitingHereDocument>
     */
    public function takeWaiting(): array
    {
        $waiting = $this->waiting;
        $this->waiting = [];

        return $waiting;
    }
}
