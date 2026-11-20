<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\WordPlace;
use App\Processes\Values\Redirect;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;

/**
 * What a simple command has read so far: its node, its arguments and redirects, and where it ends.
 */
final readonly class SimpleCommandParts
{
    /**
     * @param  list<Word>  $arguments
     * @param  list<Redirect>  $redirects
     */
    private function __construct(
        public int $node,
        public int $start,
        public int $end,
        public array $arguments,
        public array $redirects,
    ) {}

    public static function startAt(int $node, int $start): self
    {
        return new self($node, $start, $start, [], []);
    }

    public function withRedirect(Redirect $redirect): self
    {
        $redirects = [...$this->redirects, $redirect];

        return new self($this->node, $this->start, $redirect->range->end, $this->arguments, $redirects);
    }

    /**
     * Adds a read word: an argument joins the arguments, an assignment only moves the end.
     */
    public function withWord(WordToParse $word): self
    {
        $arguments = $this->arguments;

        if ($word->place === WordPlace::Argument) {
            $arguments[] = $word->word;
        }

        return new self($this->node, $this->start, $word->end(), $arguments, $this->redirects);
    }

    public function hasArguments(): bool
    {
        return $this->arguments !== [];
    }

    public function isEmpty(): bool
    {
        return $this->arguments === [] && $this->redirects === [];
    }

    public function range(): SourceRange
    {
        return new SourceRange($this->start, $this->end);
    }
}
