<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Reflection\SourceNodeAttributes;
use PHPStan\PhpDocParser\Ast\Type\GenericTypeNode;
use PHPStan\PhpDocParser\Ast\Type\IdentifierTypeNode;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Hidden as DataHidden;
use Spatie\LaravelTypeScriptTransformer\LaravelData\Transformers\DataClassTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\TypeScriptTransformer\PhpNodes\PhpClassNode;
use Spatie\TypeScriptTransformer\PhpNodes\PhpPropertyNode;
use Spatie\TypeScriptTransformer\TypeResolvers\Data\ParsedClass;
use Spatie\TypeScriptTransformer\TypeResolvers\Data\ParsedNameAndType;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptProperty;

/**
 * Turns the Data classes marked #[TypeScript] into TypeScript types, and keeps a property marked with Laravel Data's
 * #[Hidden] out of the type as well as off the wire, so an injected service never reaches the browser's types.
 */
final class HiddenAwareDataTransformer extends DataClassTransformer
{
    protected function shouldTransform(PhpClassNode $phpClassNode): bool
    {
        return parent::shouldTransform($phpClassNode)
            && SourceNodeAttributes::current()->carries($phpClassNode, TypeScript::class);
    }

    /**
     * @return array{ParsedNameAndType|null, PhpClassNode}
     */
    protected function resolvePropertyAnnotation(
        PhpPropertyNode $phpPropertyNode,
        PhpClassNode $phpClassNode,
        ParsedClass|null $parsedClass,
    ): array {
        [$annotation, $source] = parent::resolvePropertyAnnotation($phpPropertyNode, $phpClassNode, $parsedClass);
        $type = $annotation?->type;

        if (! $type instanceof GenericTypeNode || ! in_array((string) $type->type, ['list', 'non-empty-list'], true)) {
            return [
                $annotation,
                $source,
            ];
        }

        $attributes = SourceNodeAttributes::current();

        if (! $attributes->carries($phpPropertyNode, DataCollectionOf::class)) {
            return [
                $annotation,
                $source,
            ];
        }

        $itemClass = $attributes->argument($phpPropertyNode, DataCollectionOf::class, 'class');
        assert(is_string($itemClass));

        // The attribute resolves the class in the file that declares it, including when the property comes from a trait.
        $list = new GenericTypeNode($type->type, [new IdentifierTypeNode($itemClass)]);

        return [
            new ParsedNameAndType($phpPropertyNode->getName(), $list),
            $source,
        ];
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
        ) || SourceNodeAttributes::current()->carries($phpPropertyNode, DataHidden::class);
    }
}
