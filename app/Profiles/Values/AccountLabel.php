<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\AccountLabelInvalid;

/**
 * The name a person gives a saved account, trimmed, 1 to 80 characters, with no control character or path separator,
 * so it never becomes a path or a command. Two accounts of a program never share its case-folded form.
 */
final readonly class AccountLabel
{
    private function __construct(public string $label) {}

    /**
     * @throws AccountLabelInvalid
     */
    public static function from(string $text): self
    {
        $label = trim($text);
        $length = mb_strlen($label);

        if ($length < 1 || $length > 80 || preg_match('/[\p{Cc}\/\\\\]/u', $label) === 1) {
            throw AccountLabelInvalid::for($text);
        }

        return new self($label);
    }

    /**
     * The case-folded form two labels of one program may not share.
     */
    public function key(): string
    {
        return mb_strtolower($this->label);
    }
}
