<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\Values\SourceRange;
use App\Values\Redirect;

/**
 * A subshell or group part-way through: its node, the range read so far and its trailing redirects.
 */
final readonly class CompoundParts
{
    /**
     * @param  list<Redirect>  $redirects
     */
    public function __construct(
        public UnparsedCompound $toParse,
        public int $node,
        public SourceRange $range,
        public array $redirects,
    ) {}

    public function isAtRedirect(): bool
    {
        return $this->toParse->cursor()->is(TokenType::Redirect);
    }

    public function closedAt(SourceRange $range): self
    {
        return new self($this->toParse, $this->node, $range, []);
    }

    public function withRedirect(Redirect $redirect): self
    {
        $range = new SourceRange($this->range->start, $redirect->range->end);

        return new self($this->toParse, $this->node, $range, [...$this->redirects, $redirect]);
    }
}
