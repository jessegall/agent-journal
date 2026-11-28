<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;

/**
 * One PHP file's tree, with every name resolved and every node linked to its parent, as ParsedTrees made it once.
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

    public static function fromCode(string $path, string $code): self
    {
        return new self($path, $code, ParsedTrees::of($path, $code));
    }
}
