<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use Attribute;
use SensitiveParameter;

#[Attribute(Attribute::TARGET_ALL)]
#[\AllowDynamicProperties]
final class AttributeOrders
{
    #[\Override]
    #[\Deprecated]
    public function ordered(): void {}

    #[\Deprecated(message: 'a long reason for it')]
    #[\Override]
    public function longestFirst(): void {}

    public function parameter(
        #[SensitiveParameter]
        #[\Deprecated]
        string $secret,
    ): void {}
}
