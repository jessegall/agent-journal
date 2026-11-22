<?php

declare(strict_types=1);

namespace App\Support\Lines;

use App\Support\Syntax\Token;

/**
 * A source split into tokens, with its here-document bodies read; positions are relative to the source's own text.
 */
final readonly class ScannedSource
{
    /**
     * @param  list<Token>  $tokens
     */
    public function __construct(public ShellSource $source, public array $tokens) {}
}
