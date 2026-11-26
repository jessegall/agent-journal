<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Values\BooleanOperand;

final readonly class BlockOperand
{
    /**
     * @param  list<ParsedStatement>  $whenTrue
     * @param  list<ParsedStatement>  $whenFalse
     */
    public function __construct(
        public BooleanOperand $condition,
        public array $whenTrue,
        public array $whenFalse,
    ) {}
}
