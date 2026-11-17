<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\NameContext;
use PhpParser\Node\Name;
use PHPStan\PhpDocParser\Ast\AbstractNodeVisitor;
use PHPStan\PhpDocParser\Ast\Node;
use PHPStan\PhpDocParser\Ast\PhpDoc\InvalidTagValueNode;
use PHPStan\PhpDocParser\Ast\PhpDoc\PhpDocTagNode;
use PHPStan\PhpDocParser\Ast\Type\IdentifierTypeNode;

/**
 * Turns every class name of one docblock into a name use, and refuses a tag the parser could not read.
 */
final class DocblockTypeCollector extends AbstractNodeVisitor
{
    /**
     * @var list<NameUse>
     */
    public array $uses = [];

    public function __construct(
        private readonly string $path,
        private readonly int $docblockLine,
        private readonly NameContext $nameContext,
    ) {}

    public function enterNode(Node $node): null
    {
        if ($node instanceof PhpDocTagNode && $node->value instanceof InvalidTagValueNode) {
            throw DocblockTagInvalid::for($this->path, $this->lineOf($node), $node->name);
        }

        if ($node instanceof IdentifierTypeNode && self::isClassName($node->name)) {
            $this->uses[] = new NameUse($this->path, $this->lineOf($node), $this->resolved($node->name), NameType::Type);
        }

        return null;
    }

    /**
     * Built-in types such as int, list and class-string are written in lower case; class names are not.
     */
    private static function isClassName(string $identifier): bool
    {
        return str_contains($identifier, '\\') || ctype_upper($identifier[0]);
    }

    private function resolved(string $identifier): string
    {
        if (str_starts_with($identifier, '\\')) {
            return substr($identifier, 1);
        }

        return $this->nameContext->getResolvedClassName(new Name($identifier))->toString();
    }

    private function lineOf(Node $node): int
    {
        return $this->docblockLine + $node->getAttribute('startLine') - 1;
    }
}
