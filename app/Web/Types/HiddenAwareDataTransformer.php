<?php

declare(strict_types=1);

namespace App\Web\Types;

use Spatie\LaravelData\Attributes\Hidden as DataHidden;
use Spatie\LaravelTypeScriptTransformer\LaravelData\Transformers\DataClassTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\TypeScriptTransformer\PhpNodes\PhpClassNode;
use Spatie\TypeScriptTransformer\PhpNodes\PhpPropertyNode;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptProperty;

/**
 * Turns the Data classes marked #[TypeScript] into TypeScript types, and keeps a property marked with Laravel Data's
 * #[Hidden] out of the type as well as off the wire, so an injected service never reaches the browser's types.
 */
final class HiddenAwareDataTransformer extends DataClassTransformer
{
    protected function shouldTransform(PhpClassNode $phpClassNode): bool
    {
        return parent::shouldTransform($phpClassNode) && $phpClassNode->getAttributes(TypeScript::class) !== [];
    }

    protected function isPropertyHidden(
        PhpPropertyNode $phpPropertyNode,
        PhpClassNode $phpClassNode,
        TypeScriptProperty $property,
    ): bool {
        return parent::isPropertyHidden(
            $phpPropertyNode,
            $phpClassNode,
            $property,
        ) || $phpPropertyNode->getAttributes(DataHidden::class) !== [];
    }
}
