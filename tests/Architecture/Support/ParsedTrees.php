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
 * The one place a PHP file of ours is parsed: each file's tree is kept on disk by its content, so every scan, test,
 * refactoring tool and parallel worker reads the tree made once; a file this process already parsed throws ParsedTwice.
 */
final class ParsedTrees
{
    /**
     * The content hashes this process parsed.
     *
     * @var array<string, true>
     */
    private static array $parsed = [];

    private static int $parseCount = 0;

    /**
     * The file's tree with every name resolved and every node linked to its parent, as the architecture scans read it.
     *
     * @return list<Node>
     */
    public static function of(string $path, string $code): array
    {
        $traverser = new NodeTraverser(new NameResolver(), new ParentConnectingVisitor());

        return array_values($traverser->traverse(self::raw($path, $code)));
    }

    /**
     * The file's tree as the parser made it, before any visitor, for a reader that resolves it its own way.
     *
     * @return list<Node>
     */
    public static function raw(string $path, string $code): array
    {
        $hash = sha1($code);
        $cacheFile = self::folder()."/{$hash}.raw";

        if (is_file($cacheFile)) {
            $cached = @unserialize((string) file_get_contents($cacheFile));

            if (is_array($cached)) {
                /** @var list<Node> $cached */
                return $cached;
            }
        }

        if (isset(self::$parsed[$hash])) {
            throw ParsedTwice::for($path);
        }

        self::$parsed[$hash] = true;
        self::$parseCount++;
        $statements = self::parse($path, $code);
        self::write($cacheFile, $statements);

        return $statements;
    }

    /**
     * How many files this process parsed, for the test that proves a tree is made once.
     */
    public static function parseCount(): int
    {
        return self::$parseCount;
    }

    /**
     * @return list<Node>
     */
    private static function parse(string $path, string $code): array
    {
        try {
            $statements = new ParserFactory()->createForNewestSupportedVersion()->parse($code);
        } catch (Error $error) {
            throw ParseFailed::for($path, $error);
        }

        if ($statements === null) {
            throw ParseFailed::unreadable($path);
        }

        return array_values($statements);
    }

    /**
     * @param  list<Node>  $statements
     */
    private static function write(string $cacheFile, array $statements): void
    {
        if (! is_dir(dirname($cacheFile))) {
            @mkdir(dirname($cacheFile), 0777, true);
        }

        $temporary = $cacheFile.'.'.getmypid().'.'.bin2hex(random_bytes(4));
        file_put_contents($temporary, serialize($statements));
        rename($temporary, $cacheFile);
    }

    private static function folder(): string
    {
        return dirname(__DIR__, 3).'/storage/framework/testing/parsed-trees';
    }
}
