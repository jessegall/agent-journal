<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Enums\RedirectType;
use App\Enums\TokenType;
use App\Values\HereDocument;
use App\Values\SourceRange;
use App\Values\Word;

/**
 * One token of a shell line. A word carries its Word; a redirect its type and descriptor; a here-document body its
 * HereDocument and, for an unquoted body, the substitutions inside it as a Word of expansion segments.
 */
final readonly class Token
{
    public function __construct(
        public TokenType $type,
        public SourceRange $range,
        public Word|null $word = null,
        public RedirectType|null $redirect = null,
        public int $descriptor = 0,
        public HereDocument|null $hereDocument = null,
    ) {}

    /**
     * The text of a word token without expansions; any other token has none.
     */
    public function literal(): string|null
    {
        if ($this->type === TokenType::Word) {
            return $this->word?->literal();
        }

        return null;
    }
}
