<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\ReferenceRecognizer;
use App\Values\RecognizedReference;
use App\Values\SearchWords;

/**
 * Recognizes a whole input that is a task reference as the journal writes it, task 2241, in any case. It reads
 * nothing; a bare number gets the hint to type the reference in full.
 */
final readonly class TaskReferenceRecognizer implements ReferenceRecognizer
{
    private const string REFERENCE_PATTERN = '/^task ([1-9][0-9]{0,9})$/';

    private const string BARE_NUMBER_PATTERN = '/^[1-9][0-9]{0,9}$/';

    public function recognize(string $input): RecognizedReference|null
    {
        if (preg_match(self::REFERENCE_PATTERN, SearchWords::fold(trim($input)), $match) !== 1) {
            return null;
        }

        $number = (int) $match[1];

        return new RecognizedReference($number, "task {$number}");
    }

    public function hint(string $input): string|null
    {
        $trimmed = trim($input);

        if (preg_match(self::BARE_NUMBER_PATTERN, $trimmed) !== 1) {
            return null;
        }

        return "Type task {$trimmed}";
    }
}
