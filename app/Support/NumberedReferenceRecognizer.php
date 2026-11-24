<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Records\ReferenceRecognizer;
use App\Values\RecognizedReference;
use App\Values\SearchWords;

/**
 * Recognizes a whole input that is a numbered record's reference as the journal writes it, such as task 2241 or
 * In any case. It reads nothing; a bare number gets the hint to type the reference in full.
 */
abstract readonly class NumberedReferenceRecognizer implements ReferenceRecognizer
{
    private const string NUMBER_PATTERN = '[1-9][0-9]{0,9}';

    /**
     * The word the journal writes before the number, such as task.
     */
    abstract protected function word(): string;

    public function recognize(string $input): RecognizedReference|null
    {
        $pattern = '/^'.preg_quote($this->word(), '/').' ('.self::NUMBER_PATTERN.')$/';

        if (preg_match($pattern, SearchWords::fold(trim($input)), $match) !== 1) {
            return null;
        }

        $number = (int) $match[1];

        return new RecognizedReference($number, "{$this->word()} {$number}");
    }

    public function hint(string $input): string|null
    {
        $trimmed = trim($input);

        if (preg_match('/^'.self::NUMBER_PATTERN.'$/', $trimmed) !== 1) {
            return null;
        }

        return "Type {$this->word()} {$trimmed}";
    }
}
