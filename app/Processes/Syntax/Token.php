<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\RedirectType;
use App\Processes\Enums\TokenType;
use App\Processes\Values\HereDocument;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;

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
        return $this->type === TokenType::Word ? $this->word?->literal() : null;
    }
}
