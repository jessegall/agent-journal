<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\RecognizedReference;

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
}
