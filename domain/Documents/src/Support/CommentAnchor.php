<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Exceptions\AnchorMismatch;

/**
 * Where a comment points: an exact quote of a revision, found at its lines and at its byte offsets within them.
 */
final readonly class CommentAnchor
{
    public function __construct(
        public int $revisionNumber,
        public string $quote,
        public int $firstLine,
        public int $lastLine,
        public int $startOffset,
        public int $endOffset,
    ) {}

    /**
     * @throws AnchorMismatch when the stated range of the revision's text is not the quote
     */
    public function requireQuoteIn(string $revisionText): void
    {
        $range = MarkdownText::body($revisionText)->lines($this->firstLine, $this->lastLine);
        $quoted = substr($range, $this->startOffset, max(0, $this->endOffset - $this->startOffset));

        if ($this->quote === '' || $quoted !== $this->quote) {
            throw AnchorMismatch::forRevision($this->revisionNumber, $this->firstLine, $this->lastLine);
        }
    }
}
