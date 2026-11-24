<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a block of a document's Markdown is, as the reader draws it.
 */
#[TypeScript]
enum DocumentBlockType: string
{
    case Paragraph = 'paragraph';
    case Heading = 'heading';
    case Item = 'item';
    case Code = 'code';
}
