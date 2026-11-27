<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

/**
 * What a shell redirect does with its descriptor: <, >, >>, >|, <>, <&, >&, a closing &-, <<, <<<.
 */
enum RedirectType: string
{
    case Input = 'input';
    case Output = 'output';
    case Append = 'append';
    case Clobber = 'clobber';
    case ReadWrite = 'read_write';
    case DuplicateInput = 'duplicate_input';
    case DuplicateOutput = 'duplicate_output';
    case Close = 'close';
    case HereDocument = 'here_document';
    case HereString = 'here_string';

    /**
     * Whether the redirect sends a part's output away from where a reader sees it: to a file or closed.
     */
    public function hidesOutput(): bool
    {
        return match ($this) {
            self::Output, self::Append, self::Clobber, self::ReadWrite, self::Close => true,
            self::Input, self::DuplicateInput, self::DuplicateOutput, self::HereDocument, self::HereString => false,
        };
    }

    /**
     * Whether the redirect duplicates a descriptor, as <& and >& do.
     */
    public function isDuplicate(): bool
    {
        return $this === self::DuplicateInput || $this === self::DuplicateOutput;
    }
}
