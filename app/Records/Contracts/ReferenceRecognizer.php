<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Records\Values\RecognizedReference;

/**
 * Recognizes a source's own complete reference in the whole input, such as task 2241. It reads nothing and
 * changes nothing: the same input always gives the same answer.
 */
interface ReferenceRecognizer
{
    /**
     * The reference the whole input names, or null when the input is no complete reference of this source.
     */
    public function recognize(string $input): RecognizedReference|null;

    /**
     * The inline hint for an input that is only the start of a reference, such as Type task 7 for 7; null when the
     * input needs no hint. It reads nothing, so no record query runs until the input qualifies.
     */
    public function hint(string $input): string|null;
}
