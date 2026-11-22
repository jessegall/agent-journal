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
 * @implements FileScan<array{line: int, form: string, instead: string, exemption: string|null}>
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

    /**
     * The attribute that marks a method whose file access the user settled as outside the places.
     */
    private const string EXEMPTION_MARK = 'App\Attributes\OutsideThePlaces';

    public function key(): string
    {
        return 'file-functions-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
    }

    /**
     * @return list<array{line: int, form: string, instead: string, exemption: string|null}>
     */
    public static function of(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $findings = [];

        foreach ($finder->findInstanceOf($file->statements, Expr\FuncCall::class) as $call) {
            if (! $call->name instanceof Node\Name || ! self::isBannedFunction($call, $call->name)) {
                continue;
            }

            $function = $call->name->toLowerString();
            $findings[] = self::finding($call, "{$function}()", self::FUNCTIONS[$function]);
        }

        foreach ($finder->findInstanceOf($file->statements, Expr\New_::class) as $new) {
            if (! $new->class instanceof Node\Name || ! isset(self::ITERATORS[$new->class->toString()])) {
                continue;
            }

            $class = $new->class->toString();
            $findings[] = self::finding($new, "new {$class}", self::ITERATORS[$class]);
        }

        foreach ($finder->findInstanceOf($file->statements, Node\Name::class) as $name) {
            $class = $name->toString();

            if (isset(self::CLASSES[$class]) && ! $name->getAttribute('parent') instanceof Node\UseItem) {
                $findings[] = self::finding($name, $class, self::CLASSES[$class]);
            }
        }

        usort($findings, fn (array $one, array $other) => $one['line'] <=> $other['line']);

        return $findings;
    }

    /**
     * @return array{line: int, form: string, instead: string, exemption: string|null}
     */
    private static function finding(Node $node, string $form, string $instead): array
    {
        return [
            'line' => $node->getStartLine(),
            'form' => $form,
            'instead' => $instead,
            'exemption' => self::exemptionOf($node),
        ];
    }

    /**
     * The PlaceExemption case the method around the node names with #[OutsideThePlaces], such as
     * CommandFileSystem; none when the method has no such mark.
     */
    private static function exemptionOf(Node $node): string|null
    {
        $method = $node->getAttribute('parent');

        while ($method instanceof Node && ! self::isNamedFunction($method)) {
            $method = $method->getAttribute('parent');
        }

        if (! $method instanceof Node\Stmt\ClassMethod && ! $method instanceof Node\Stmt\Function_) {
            return null;
        }

        foreach ($method->getAttrGroups() as $group) {
            foreach ($group->attrs as $attribute) {
                $reason = $attribute->args[0]->value ?? null;

                if ($attribute->name->toString() === self::EXEMPTION_MARK
                    && $reason instanceof Expr\ClassConstFetch
                    && $reason->name instanceof Node\Identifier) {
                    return $reason->name->toString();
                }
            }
        }

        return null;
    }

    /**
     * Whether the node is a method or a named function; a closure inside one takes its mark from it.
     */
    private static function isNamedFunction(Node $node): bool
    {
        return $node instanceof Node\Stmt\ClassMethod || $node instanceof Node\Stmt\Function_;
    }

    /**
     * Whether the call names a banned global function, through a 'use function', a leading backslash or the
     * fallback from a namespace, and is not a read of a php:// stream such as php://stdin; is_dir(...) as a callable
     * counts too.
     */
    private static function isBannedFunction(Expr\FuncCall $call, Node\Name $name): bool
    {
        if (count($name->getParts()) !== 1 || ! isset(self::FUNCTIONS[$name->toLowerString()])) {
            return false;
        }

        $first = $call->isFirstClassCallable() ? null : ($call->getArgs()[0] ?? null);

        return ! ($first !== null
            && $first->value instanceof Node\Scalar\String_
            && str_starts_with($first->value->value, 'php://'));
    }
}
