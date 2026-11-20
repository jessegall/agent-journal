<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The places a file touches the disk directly: a call to a PHP file function, a directory iterator made with new, or
 * a name of Finder, Laravel's Filesystem or its File facade. Each finding names the Files method to use instead. A
 * method or static call that only shares a function's name, and a call on a php:// stream, are not file access.
 *
 * @implements FileScan<array{line: int, form: string, instead: string}>
 */
final readonly class FileFunctionScan implements FileScan
{
    /**
     * Each banned function and the Files method that does its job.
     */
    private const array FUNCTIONS = [
        'file_get_contents' => 'Files::read',
        'file_put_contents' => 'Files::write or Files::append',
        'file' => 'Files::read',
        'fopen' => 'Files::read, Files::write or Files::append',
        'readfile' => 'Files::read',
        'parse_ini_file' => 'Files::read',
        'is_file' => 'Files::exists',
        'file_exists' => 'Files::exists',
        'is_readable' => 'Files::exists',
        'is_dir' => 'Files::isFolder',
        'is_link' => 'Files::list, whose entries say which are links',
        'readlink' => 'Files::list, whose entries say which are links',
        'is_writable' => 'Files::fingerprint',
        'is_executable' => 'Files::fingerprint',
        'filemtime' => 'Files::fingerprint',
        'filesize' => 'Files::fingerprint',
        'fileperms' => 'Files::fingerprint',
        'stat' => 'Files::fingerprint',
        'lstat' => 'Files::fingerprint',
        'realpath' => 'Files::filePathOf',
        'glob' => 'Files::list or Files::matching',
        'scandir' => 'Files::list',
        'opendir' => 'Files::list',
        'mkdir' => 'Files::makeFolder',
        'rmdir' => 'Files::deleteFolder',
        'unlink' => 'Files::delete',
        'rename' => 'Files::move',
        'copy' => 'Files::read and Files::write',
        'touch' => 'Files::write',
        'chmod' => 'Files::write with its Permissions',
        'symlink' => 'Files::link',
        'link' => 'Files::link',
        'tempnam' => 'Files::scratch',
        'hash_file' => 'Files::digest',
        'md5_file' => 'Files::digest',
        'sha1_file' => 'Files::digest',
        'disk_free_space' => 'Files::freeSpace',
    ];

    /**
     * Each banned class made with new, and the Files method that does its job.
     */
    private const array ITERATORS = [
        'RecursiveDirectoryIterator' => 'Files::list with a Depth',
        'DirectoryIterator' => 'Files::list',
        'FilesystemIterator' => 'Files::list',
        'SplFileObject' => 'Files::read',
    ];

    /**
     * Each banned class named anywhere, and what to use instead.
     */
    private const array CLASSES = [
        'Symfony\Component\Finder\Finder' => 'Files::list or Files::matching',
        'Illuminate\Filesystem\Filesystem' => 'Files',
        'Illuminate\Support\Facades\File' => 'Files',
    ];

    public function key(): string
    {
        return 'file-functions-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
    }

    /**
     * @return list<array{line: int, form: string, instead: string}>
     */
    public static function of(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->find($file->statements, fn (Node $node) => self::isDirectAccess($node)) as $node) {
            $findings[] = self::findingOf($node);
        }

        return $findings;
    }

    private static function isDirectAccess(Node $node): bool
    {
        return match (true) {
            $node instanceof Expr\FuncCall => self::isBannedFunction($node),
            $node instanceof Expr\New_ => $node->class instanceof Node\Name
                && isset(self::ITERATORS[$node->class->toString()]),
            $node instanceof Node\Name => isset(self::CLASSES[$node->toString()])
                && ! $node->getAttribute('parent') instanceof Node\UseItem,
            default => false,
        };
    }

    /**
     * Whether the call names a banned global function, through a 'use function', a leading backslash or the
     * fallback from a namespace, and is not a read of a php:// stream such as php://stdin.
     */
    private static function isBannedFunction(Expr\FuncCall $call): bool
    {
        if (! $call->name instanceof Node\Name || count($call->name->getParts()) !== 1) {
            return false;
        }

        $first = $call->getArgs()[0] ?? null;
        $readsAStream = $first !== null
            && $first->value instanceof Node\Scalar\String_
            && str_starts_with($first->value->value, 'php://');

        return isset(self::FUNCTIONS[$call->name->toLowerString()]) && ! $readsAStream;
    }

    /**
     * @return array{line: int, form: string, instead: string}
     */
    private static function findingOf(Node $node): array
    {
        return match (true) {
            $node instanceof Expr\FuncCall && $node->name instanceof Node\Name => [
                'line' => $node->getStartLine(),
                'form' => $node->name->toLowerString().'()',
                'instead' => self::FUNCTIONS[$node->name->toLowerString()],
            ],
            $node instanceof Expr\New_ && $node->class instanceof Node\Name => [
                'line' => $node->getStartLine(),
                'form' => "new {$node->class->toString()}",
                'instead' => self::ITERATORS[$node->class->toString()],
            ],
            $node instanceof Node\Name => [
                'line' => $node->getStartLine(),
                'form' => $node->toString(),
                'instead' => self::CLASSES[$node->toString()],
            ],
        };
    }
}
