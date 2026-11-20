<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use Attribute;

#[Attribute(Attribute::TARGET_ALL)]
final class Marked {}

final class AttributePlacements
{
    #[Marked] public string $inlineProperty = '';

    #[Marked]
    public string $standaloneProperty = '';

    public function __construct(
        #[Marked] public string $inlinePromoted,
        #[Marked]
        public string $standalonePromoted,
        #[Marked] string $plainParameter,
    ) {
        $this->standaloneProperty = $plainParameter;
    }
}
