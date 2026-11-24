<?php

declare(strict_types=1);

/*
 * Moves a whole batch of classes from the abstract syntax tree alone.
 * Every PHP file of the project is parsed once and held in memory with its names resolved to full classes. The batch's
 * rename map is then applied to those trees: each change is an edit at the exact position of a node, and each touched
 * file is written once. The files move with git mv afterwards.
 *
 *   php tools/refactoring/layout/batch-move.php <moves.txt> [--root=<tree>]
 *
 * A line of moves.txt is `Old\Class New\Class old/path.php new/path.php`, with `merge` after it when New already
 * exists: every reference then names New and the old file is deleted instead of moved. From the tree it rewrites: the namespace name
 * of a moved file; each import of a moved class, and an import of a class in the moved file's own new namespace goes;
 * each qualified name of a moved class; the short name where a move renames a class; an import, after the last import
 * node, for each class a file named bare through its namespace that is no longer beside it; and inside string and
 * comment nodes, a moved class's full name or old file path. Files that are not PHP, such as the docs, get the full
 * class names and old file paths rewritten. It fails, naming them, on a file that no longer parses or a node that still names an old class.
 */

use PhpParser\Comment;
use PhpParser\Node;
use PhpParser\Node\InterpolatedStringPart;
use PhpParser\Node\Name;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\GroupUse;
use PhpParser\Node\Stmt\Namespace_;
use PhpParser\Node\Stmt\Use_;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitorAbstract;
use PhpParser\Parser;
use PhpParser\ParserFactory;

require dirname(__DIR__, 3).'/vendor/autoload.php';
require_once dirname(__DIR__).'/php-parse.php';

// The whole codebase is held as trees at once, which needs more than PHP's default memory.
ini_set('memory_limit', '-1');

/**
 * What one parsed file holds that a move can change: its namespace, its import statements and items, every class name
 * in code with the full class it resolves to, its string parts and its comments, each with its place in the text.
 */
final class FileTree extends NodeVisitorAbstract
{
    public Namespace_|null $namespace = null;

    /** @var list<Use_|GroupUse> */
    public array $importStatements = [];

    /** @var list<array{item: Node\UseItem, statement: Use_|GroupUse, prefix: string}> */
    public array $imports = [];

    /** @var list<Name> */
    public array $names = [];

    /** @var list<String_|InterpolatedStringPart> */
    public array $strings = [];

    /** @var array<int, Comment> */
    public array $comments = [];

    /** @var list<string> */
    public array $declared = [];

    /** @var list<Node\Stmt\ClassLike> */
    public array $declarations = [];

    private int $importDepth = 0;

    public static function of(Parser $parser, string $file, string $source): self
    {
        $tree = new self();
        $traverser = new NodeTraverser(new NameResolver(null, ['replaceNodes' => false]), $tree);
        $traverser->traverse(parsedOnce($parser, $file, $source));

        return $tree;
    }

    public function enterNode(Node $node): null
    {
        foreach ($node->getComments() as $comment) {
            $this->comments[$comment->getStartFilePos()] = $comment;
        }

        if ($node instanceof Namespace_) {
            $this->namespace = $node;
        }

        if (($node instanceof Use_ && $node->type === Use_::TYPE_NORMAL) || $node instanceof GroupUse) {
            $this->importStatements[] = $node;

            foreach ($node->uses as $use) {
                $this->imports[] = ['item' => $use, 'statement' => $node, 'prefix' => $node instanceof GroupUse ? $node->prefix->toString() : ''];
            }

            $this->importDepth++;
        }

        if ($node instanceof Node\Stmt\ClassLike && $node->name !== null) {
            $this->declared[] = $node->name->toString();
            $this->declarations[] = $node;
        }

        if ($node instanceof String_ || $node instanceof InterpolatedStringPart) {
            $this->strings[] = $node;
        }

        if ($this->importDepth === 0 && $node instanceof Name && ! $node->isSpecialClassName() && $node->getAttribute('resolvedName') instanceof Name) {
            $this->names[] = $node;
        }

        return null;
    }

    public function leaveNode(Node $node): null
    {
        if ($node instanceof Use_ || $node instanceof GroupUse) {
            $this->importDepth--;
        }

        return null;
    }
}

$root = dirname(__DIR__, 3);
$listPath = null;

foreach (array_slice($argv, 1) as $argument) {
    if (str_starts_with($argument, '--root=')) {
        $root = substr($argument, 7);

        continue;
    }

    $listPath = $argument;
}

$root = realpath($root) ?: exit(fail(['The tree root does not exist.']));
$listPath ?? exit(fail(['Name a moves file.']));
$moves = [];

foreach (file($listPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
    [$old, $new, $oldPath, $newPath, $mode] = array_pad(preg_split('/\s+/', trim($line)) ?: [], 5, '');
    $moves[ltrim($old, '\\')] = ['class' => ltrim($new, '\\'), 'from' => $oldPath, 'to' => $newPath, 'merge' => $mode === 'merge'];
}

$renames = array_map(fn (array $move) => $move['class'], $moves);
$paths = array_column($moves, 'to', 'from');
$movedFiles = $paths;
$started = microtime(true);
$listed = array_values(array_filter(explode("\n", (string) shell_exec(
    'cd '.escapeshellarg($root).' && git ls-files -co --exclude-standard -- app domain tests tools config bootstrap routes database resources docs .ai .commandments/custom phpstan.neon phpunit.xml',
)), fn (string $file) => $file !== '' && ! str_starts_with($file, 'tools/refactoring/layout/') && ! str_contains($file, '/vendor/') && is_file("{$root}/{$file}")));
$parser = new ParserFactory()->createForNewestSupportedVersion();

// The whole codebase, parsed once and kept: file => [source, tree].
$trees = [];
$unparsed = [];

foreach ($listed as $file) {
    if (! str_ends_with($file, '.php')) {
        continue;
    }

    $source = (string) file_get_contents("{$root}/{$file}");

    try {
        $trees[$file] = [$source, FileTree::of($parser, $file, $source)];
    } catch (Throwable) {
        $unparsed[] = $file;
    }
}

$parsedIn = microtime(true) - $started;
$rewritten = [];
$failures = [];

foreach ($trees as $file => [$source, $tree]) {
    $result = rewriteFile($source, $tree, $renames, $paths, $movedFiles[$file] ?? null, $moves);

    if ($result === $source) {
        continue;
    }

    try {
        $after = FileTree::of($parser, "{$file} (rewritten)", $result);
    } catch (Throwable $error) {
        $failures[] = "{$file} would not parse after the rewrite: {$error->getMessage()}";

        continue;
    }

    foreach (oldNamesIn($after, $renames) as $left) {
        $failures[] = "{$file} still names {$left}";
    }

    $trees[$file] = [$result, $after];
    $rewritten[$file] = $result;
}

if ($failures !== []) {
    exit(fail(['Nothing was written:', ...$failures]));
}

foreach ($rewritten as $file => $result) {
    file_put_contents("{$root}/{$file}", $result);
}

// Files that are not PHP hold no tree; a full class name or an old path written in one follows its class or file.
foreach ($listed as $file) {
    if (str_ends_with($file, '.php')) {
        continue;
    }

    $text = (string) file_get_contents("{$root}/{$file}");
    $repathed = renamedText($text, $renames, $paths);

    if ($repathed !== $text) {
        file_put_contents("{$root}/{$file}", $repathed);
        $rewritten[$file] = $repathed;
    }
}

foreach ($moves as $move) {
    if ($move['merge']) {
        exec('cd '.escapeshellarg($root).' && git rm -qf '.escapeshellarg($move['from']).' 2>&1', $output, $status);
        $status === 0 || unlink("{$root}/{$move['from']}");

        continue;
    }

    if (! is_dir(dirname("{$root}/{$move['to']}"))) {
        mkdir(dirname("{$root}/{$move['to']}"), 0755, true);
    }

    exec('cd '.escapeshellarg($root).' && git mv '.escapeshellarg($move['from']).' '.escapeshellarg($move['to']).' 2>&1', $output, $status);

    if ($status !== 0) {
        rename("{$root}/{$move['from']}", "{$root}/{$move['to']}");
    }

    $folder = dirname("{$root}/{$move['from']}");

    while ($folder !== $root && is_dir($folder) && count(scandir($folder) ?: []) === 2) {
        rmdir($folder);
        $folder = dirname($folder);
    }
}

printf(
    "%d classes moved, %d files parsed in %.1f s, %d rewritten, in %.1f s%s\n",
    count($moves),
    count($trees),
    $parsedIn,
    count($rewritten),
    microtime(true) - $started,
    $unparsed === [] ? '' : '; not parsable, left alone: '.implode(', ', $unparsed),
);

exit(0);

/**
 * The file's text with every edit the batch asks of its tree, applied from the end so earlier positions stay right.
 *
 * @param  array<string, string>  $renames
 * @param  array<string, string>  $paths
 * @param  array<string, array{class: string, from: string, to: string}>  $moves
 */
function rewriteFile(string $source, FileTree $tree, array $renames, array $paths, string|null $movedTo, array $moves): string
{
    $oldNamespace = $tree->namespace?->name?->toString() ?? '';
    $newNamespace = $movedTo === null ? $oldNamespace : namespaceOfMove($moves, $oldNamespace, $tree);
    $edits = [];
    $imported = [];
    $needed = [];
    $shortRenames = [];

    if ($movedTo !== null && $tree->namespace?->name !== null && $newNamespace !== $oldNamespace) {
        $edits[] = [$tree->namespace->name->getStartFilePos(), $tree->namespace->name->getEndFilePos(), $newNamespace];
    }

    // A move that renames the class renames its declaration too.
    foreach ($tree->declarations as $declaration) {
        $target = $renames[ltrim("{$oldNamespace}\\{$declaration->name}", '\\')] ?? null;

        if ($target !== null && shortName($target) !== $declaration->name->toString()) {
            $edits[] = [$declaration->name->getStartFilePos(), $declaration->name->getEndFilePos(), shortName($target)];
        }
    }

    foreach ($tree->imports as ['item' => $use, 'statement' => $statement, 'prefix' => $prefix]) {
        $full = ltrim(($prefix !== '' ? $prefix.'\\' : '').$use->name->toString(), '\\');
        $alias = $use->alias?->toString() ?? shortName($full);
        $target = $renames[$full] ?? $full;
        $imported[strtolower($alias)] = $target;

        // An import of a class in the moved file's own new namespace says nothing there: the statement goes.
        if ($movedTo !== null && $prefix === '' && count($statement->uses) === 1 && $use->alias === null && namespaceOf($target) === $newNamespace) {
            $edits[] = [$statement->getStartFilePos(), lineEnd($source, $statement->getEndFilePos()), ''];

            continue;
        }

        if ($target === $full) {
            continue;
        }

        $edits[] = [$use->name->getStartFilePos(), $use->name->getEndFilePos(), $prefix !== '' ? relativeTo($target, $prefix) : $target];

        if ($use->alias === null && shortName($target) !== shortName($full)) {
            $shortRenames[strtolower(shortName($full))] = shortName($target);
        }
    }

    foreach ($tree->names as $name) {
        $resolved = $name->getAttribute('resolvedName')->toString();
        $written = $name->toString();
        $target = $renames[$resolved] ?? $resolved;
        $start = $name->getStartFilePos();
        $end = $name->getEndFilePos();

        if ($name->isFullyQualified() || str_contains($written, '\\')) {
            if ($target !== $resolved) {
                $edits[] = [$start, $end, '\\'.$target];
            }

            continue;
        }

        $local = strtolower($written);

        if (isset($imported[$local])) {
            if (isset($shortRenames[$local])) {
                $edits[] = [$start, $end, $shortRenames[$local]];
            }

            continue;
        }

        // Named bare through its namespace: it still resolves only when it ends up in the file's new namespace.
        if (namespaceOf($target) === $newNamespace || in_array($written, $tree->declared, true)) {
            if (shortName($target) !== $written && namespaceOf($target) === $newNamespace) {
                $edits[] = [$start, $end, shortName($target)];
            }

            continue;
        }

        $needed[$target] = true;

        if (shortName($target) !== $written) {
            $edits[] = [$start, $end, shortName($target)];
        }
    }

    foreach ($tree->strings as $string) {
        $text = substr($source, $string->getStartFilePos(), $string->getEndFilePos() - $string->getStartFilePos() + 1);
        $renamed = renamedText($text, $renames, $paths);

        if ($renamed !== $text) {
            $edits[] = [$string->getStartFilePos(), $string->getEndFilePos(), $renamed];
        }
    }

    foreach ($tree->comments as $comment) {
        $renamed = renamedBareNames(
            renamedText($comment->getText(), $renames, $paths),
            $shortRenames,
            $renames,
            $oldNamespace,
            $imported,
        );

        if ($renamed !== $comment->getText()) {
            $edits[] = [$comment->getStartFilePos(), $comment->getEndFilePos(), $renamed];
        }

        // A docblock type that names a class bare through the file's own namespace needs an import once the class
        // ends up in another namespace than the file, as a name in code does.
        foreach (bareNamesIn($comment->getText()) as $written) {
            $target = $renames[ltrim("{$oldNamespace}\\{$written}", '\\')] ?? null;
            $local = strtolower($written);

            if ($target === null || isset($imported[$local]) || in_array($written, $tree->declared, true)) {
                continue;
            }

            if (namespaceOf($target) !== $newNamespace) {
                $needed[$target] = true;
            }
        }
    }

    $newImports = array_values(array_diff(array_keys($needed), array_values($imported)));

    if ($newImports !== []) {
        sort($newImports);
        $lines = implode('', array_map(fn (string $class) => "\nuse {$class};", $newImports));
        $anchor = $tree->importStatements === [] ? $tree->namespace?->name : end($tree->importStatements);

        if ($anchor !== null) {
            // After the last import statement, or after the namespace name's semicolon when there is none.
            $at = $tree->importStatements === [] ? strpos($source, ';', $anchor->getEndFilePos()) : $anchor->getEndFilePos();
            $edits[] = [$at + 1, $at, $tree->importStatements === [] ? "\n{$lines}" : $lines];
        }
    }

    usort($edits, fn (array $a, array $b) => $b[0] <=> $a[0]);

    foreach ($edits as [$start, $end, $text]) {
        $source = substr($source, 0, $start).$text.substr($source, $end + 1);
    }

    return $source;
}

/**
 * A string or comment node's text with each moved class's full name, written with one or two backslashes, and each
 * moved file's old path replaced. The node is found by the tree; only its own text is read here.
 *
 * @param  array<string, string>  $renames
 * @param  array<string, string>  $paths
 */
function renamedText(string $text, array $renames, array $paths): string
{
    $replacements = [];

    foreach ($renames as $old => $new) {
        if (str_contains($text, shortName($old))) {
            $replacements[$old] = $new;
            $replacements[str_replace('\\', '\\\\', $old)] = str_replace('\\', '\\\\', $new);
        }
    }

    foreach ($paths as $old => $new) {
        if (str_contains($text, $old)) {
            $replacements[$old] = $new;
        }
    }

    if ($replacements === []) {
        return $text;
    }

    // Whole names only: App\X\Domain must not touch App\X\DomainEntry, so a match must end where a name ends.
    $result = '';
    $length = strlen($text);
    $at = 0;
    uksort($replacements, fn (string $a, string $b) => strlen($b) <=> strlen($a));

    while ($at < $length) {
        foreach ($replacements as $old => $new) {
            $next = $text[$at + strlen($old)] ?? '';

            if (substr_compare($text, $old, $at, strlen($old)) === 0
                && ($at === 0 || ! isNamePart($text[$at - 1]))
                && ! isNamePart($next)) {
                $result .= $new;
                $at += strlen($old);

                continue 2;
            }
        }

        $result .= $text[$at];
        $at++;
    }

    return $result;
}

/**
 * The comment with each class it names bare given its new short name: a class imported under its own name, or one of
 * the file's own namespace, that the batch renames. A name imported under an alias keeps the alias.
 *
 * @param  array<string, string>  $shortRenames  old short name, lowercase, to new short name, for the file's imports
 * @param  array<string, string>  $renames
 * @param  array<string, string>  $imported  alias, lowercase, to the class it names
 */
function renamedBareNames(string $text, array $shortRenames, array $renames, string $namespace, array $imported): string
{
    return (string) preg_replace_callback('/(?<![\\\\\\w$])[A-Z][A-Za-z0-9]*\\b/', function (array $match) use ($shortRenames, $renames, $namespace, $imported): string {
        $written = $match[0];
        $local = strtolower($written);

        if (isset($shortRenames[$local])) {
            return $shortRenames[$local];
        }

        $sibling = $renames[ltrim("{$namespace}\\{$written}", '\\')] ?? null;

        if ($sibling === null || isset($imported[$local])) {
            return $written;
        }

        return shortName($sibling);
    }, $text);
}

/**
 * The class names a comment writes bare, without a namespace: each capitalised word not preceded by a backslash.
 *
 * @return list<string>
 */
function bareNamesIn(string $text): array
{
    preg_match_all('/(?<![\\\\\\w$])[A-Z][A-Za-z0-9]*\\b/', $text, $matches);

    return array_values(array_unique($matches[0]));
}

function isNamePart(string $character): bool
{
    return $character !== '' && (ctype_alnum($character) || $character === '_' || $character === '\\');
}

/**
 * The names of moved classes a parsed file still holds, in code, strings or comments.
 *
 * @param  array<string, string>  $renames
 * @return list<string>
 */
function oldNamesIn(FileTree $tree, array $renames): array
{
    $left = [];

    foreach ($tree->names as $name) {
        if (isset($renames[$name->getAttribute('resolvedName')->toString()])) {
            $left[] = $name->getAttribute('resolvedName')->toString();
        }
    }

    foreach ($tree->imports as ['item' => $use, 'prefix' => $prefix]) {
        $full = ltrim(($prefix !== '' ? $prefix.'\\' : '').$use->name->toString(), '\\');

        if (isset($renames[$full])) {
            $left[] = $full;
        }
    }

    return array_values(array_unique($left));
}

/**
 * The namespace a moved file lands in: the namespace of the class it declares, after the move.
 *
 * @param  array<string, array{class: string, from: string, to: string}>  $moves
 */
function namespaceOfMove(array $moves, string $oldNamespace, FileTree $tree): string
{
    foreach ($tree->declared as $declared) {
        $class = ltrim("{$oldNamespace}\\{$declared}", '\\');

        if (isset($moves[$class])) {
            return namespaceOf($moves[$class]['class']);
        }
    }

    return $oldNamespace;
}

/**
 * The position of the line break that ends the line a statement ends on, so removing the statement removes its line.
 */
function lineEnd(string $source, int $end): int
{
    if (($source[$end + 1] ?? '') === "\n") {
        return $end + 1;
    }

    return $end;
}

function shortName(string $class): string
{
    return substr($class, (int) strrpos('\\'.$class, '\\'));
}

function namespaceOf(string $class): string
{
    $at = strrpos($class, '\\');

    if ($at === false) {
        return '';
    }

    return substr($class, 0, $at);
}

function relativeTo(string $class, string $prefix): string
{
    if (str_starts_with($class, $prefix.'\\')) {
        return substr($class, strlen($prefix) + 1);
    }

    return $class;
}

/**
 * @param  list<string>  $failures
 */
function fail(array $failures): int
{
    fwrite(STDERR, "fail:\n- ".implode("\n- ", $failures)."\n");

    return 1;
}
