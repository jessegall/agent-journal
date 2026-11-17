<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Error;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\ParserFactory;

/**
 * One PHP file parsed once, with every name resolved and every node linked to its parent.
 */
final readonly class ParsedFile
{
    /**
     * @param  list<Node>  $statements
     */
    private function __construct(
        public string $path,
        public string $code,
        public array $statements,
    ) {}

    public static function fromPath(string $path): self
    {
        $code = file_get_contents($path);

        if ($code === false) {
            throw ParseFailed::unreadable($path);
        }

        return self::fromCode($path, $code);
    }

    private static function fromCode(string $path, string $code): self
    {
        try {
            $statements = (new ParserFactory)->createForNewestSupportedVersion()->parse($code);
        } catch (Error $error) {
            throw ParseFailed::for($path, $error);
        }

        if ($statements === null) {
            throw ParseFailed::unreadable($path);
        }

        $traverser = new NodeTraverser(new NameResolver, new ParentConnectingVisitor);

        return new self($path, $code, array_values($traverser->traverse($statements)));
    }
}
