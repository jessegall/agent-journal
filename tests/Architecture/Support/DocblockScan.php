<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Comment\Doc;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitorAbstract;
use PHPStan\PhpDocParser\Ast\NodeTraverser as DocblockTraverser;
use PHPStan\PhpDocParser\Lexer\Lexer;
use PHPStan\PhpDocParser\Parser\ConstExprParser;
use PHPStan\PhpDocParser\Parser\PhpDocParser;
use PHPStan\PhpDocParser\Parser\TokenIterator;
use PHPStan\PhpDocParser\Parser\TypeParser;
use PHPStan\PhpDocParser\ParserConfig;

/**
 * Every class name the docblocks of a file use as a type, resolved through the file's namespace and imports.
 */
final class DocblockScan extends NodeVisitorAbstract
{
    /**
     * @var array<int, list<NameUse>>
     */
    private array $usesByDocblock = [];

    private function __construct(
        private readonly ParsedFile $file,
        private readonly NameResolver $resolver,
        private readonly Lexer $lexer,
        private readonly PhpDocParser $parser,
    ) {}

    /**
     * @return list<NameUse>
     */
    public static function of(ParsedFile $file): array
    {
        $config = new ParserConfig(['lines' => true]);
        $constants = new ConstExprParser($config);
        $resolver = new NameResolver(null, ['replaceNodes' => false]);
        $scan = new self($file, $resolver, new Lexer($config), new PhpDocParser($config, new TypeParser($config, $constants), $constants));

        (new NodeTraverser($resolver, $scan))->traverse($file->statements);

        return array_merge(...array_values($scan->usesByDocblock));
    }

    public function enterNode(Node $node): null
    {
        foreach ($node->getComments() as $comment) {
            if (! $comment instanceof Doc || isset($this->usesByDocblock[$comment->getStartFilePos()])) {
                continue;
            }

            $this->usesByDocblock[$comment->getStartFilePos()] = $this->typesIn($comment);
        }

        return null;
    }

    /**
     * @return list<NameUse>
     */
    private function typesIn(Doc $doc): array
    {
        $docblock = $this->parser->parse(new TokenIterator($this->lexer->tokenize($doc->getText())));
        $collector = new DocblockTypeCollector($this->file->path, $doc->getStartLine(), $this->resolver->getNameContext());

        (new DocblockTraverser([$collector]))->traverse([$docblock]);

        return $collector->uses;
    }
}
