<?php

declare(strict_types=1);

/**
 * Move or rename a class, with every reference to it — the import in each consumer, the namespace it
 * is declared under, and the import a former neighbour now needs.
 *
 *   php tools/refactoring/move.php App\\Core\\Hooks\\AgentStacks Stacks
 *   php tools/refactoring/move.php App\\Core\\Hooks\\AgentStacks App\\Core\\Hooks\\Stack\\AgentStacks
 *   php tools/refactoring/move.php --namespace=App\\Domain\\Hooks App\\Core\\Hooks
 *   php tools/refactoring/move.php --list=tools/refactoring/renames.txt
 *   php tools/refactoring/move.php --list=… --dry-run
 *   php tools/refactoring/move.php --replace Modifiers\\Open Marks\\Open
 *
 * A line in a list file is `Old New`, or `Old New # why`. Blank lines and lines
 * starting with # are ignored.
 *
 * Give the new name alone to rename in place, or a fully written name (`App\\...` or `Tests\\...`) to move it
 * as well; each root namespace lives in the folder composer.json's PSR-4 section gives it. `--namespace=` moves every class
 * declared under one namespace into another, and `--dry-run` reports without writing.
 *
 * `--replace` is the other operation: the destination ALREADY EXISTS, so nothing is relocated —
 * every reference to the source is repointed at the class that stays, and the source file is
 * deleted. That is a MERGE, and it is what you want whenever two classes say the same thing in two
 * mechanisms and one of them is being retired. Moving the loser somewhere tidier only relocates the
 * mechanism; replacing it removes one. It refuses when nothing declares the destination, because a
 * `--replace` at a name that does not exist would delete the source and leave every reference
 * pointing at nothing.
 */
const ROOT = __DIR__.'/../..';
/**
 * Names are written in full (`App\\Core\\Hooks\\AgentStacks`, `Tests\\Support\\RefreshHookDatabase`), so no package
 * prefix is added to them. Each root namespace maps to its folder, as composer.json's PSR-4 section says.
 */
const PACKAGE = '';
const SEARCHED = ['app', 'domain', 'tests', 'routes', 'bootstrap', 'config', 'database'];
const SKIPPED = ['__DEPRECATED', '__deprecated', 'vendor', 'node_modules'];

$arguments = array_slice($argv, 1);

if (in_array('--test', $arguments, true)) {
    exit(selfTest());
}

$dry = in_array('--dry-run', $arguments, true);
$replacing = in_array('--replace', $arguments, true);
$arguments = array_values(array_filter(
    $arguments,
    static fn (string $one): bool => $one !== '--dry-run' && $one !== '--replace',
));

$moves = [];
$namespace = '';

foreach ($arguments as $argument) {
    if (str_starts_with($argument, '--list=')) {
        $moves = [...$moves, ...listed(substr($argument, 7))];

        continue;
    }

    if (str_starts_with($argument, '--namespace=')) {
        $namespace = trim(substr($argument, 12), '\\');

        continue;
    }

    $moves[] = $argument;
}

if ($namespace !== '') {
    $into = trim($moves[0] ?? '', '\\');

    if ($into === '') {
        exit(usage());
    }

    $declared = declaredUnder($namespace);

    if ($declared === []) {
        exit(printf("Nothing is declared under %s.\n", PACKAGE.$namespace));
    }

    printf("%s %d class(es) from %s into %s\n\n", $dry ? 'Would move' : 'Moving', count($declared), $namespace, $into);

    // named in full on both sides: a short name from a sub-namespace is one several classes may share,
    // and the sub-namespace it sits in is carried across rather than flattened away
    $moves = array_map(
        static fn (string $one): string => $namespace.'\\'.$one.' '.$into.'\\'.$one,
        $declared,
    );
}

if (count($moves) === 2 && ! str_contains($moves[0], ' ')) {
    $moves = [$moves[0].' '.$moves[1]];
}

if ($moves === []) {
    exit(usage());
}

$done = 0;
$missed = [];
$was = [];
$at = 0;
$total = count($moves);

foreach ($moves as $move) {
    [$old, $new] = array_pad(preg_split('/\s+/', trim($move)), 2, '');

    if ($old === '' || $new === '') {
        continue;
    }

    $files = sources();
    $where = declaredIn($old, $files, $namespace);

    if ($where !== null) {
        $was[] = namespaceOf($where).'\\'.shortNameOf($old);
    }

    $applied = $replacing
        ? replace($old, $new, $files, $dry, $namespace, progress($at++, $total))
        : move($old, $new, $files, $dry, $namespace, progress($at++, $total));

    $applied ? $done++ : $missed[] = $old;
}

echo sprintf(
    "\n%s %d class(es).\n",
    match (true) {
        $replacing && $dry => 'Would replace',
        $replacing => 'Replaced',
        $dry => 'Would move',
        default => 'Moved',
    },
    $done,
);

if ($missed !== []) {
    printf("Not found: %s\n", implode(', ', $missed));
}

if (! $dry) {
    report(dangling($was, sources()));
}

/**
 * Where a run has got to, said on the line the move prints anyway. A namespace move is hundreds of
 * classes and a minute of silence otherwise, and silence and a hang look the same from outside.
 */
/**
 * A folder the move searches for references is not there, so the scan would narrow in silence.
 */
final class SearchedFolderMissing extends RuntimeException
{
    public static function for(string $folder): self
    {
        return new self(sprintf('[%s] is searched for references but does not exist.', $folder));
    }
}

function progress(int $at, int $of): string
{
    if ($of < 2) {
        return ' ';
    }

    $width = 20;
    $filled = (int) round($width * ($at + 1) / $of);

    return sprintf(
        '[%s%s] %*d/%d',
        str_repeat('=', $filled),
        str_repeat(' ', $width - $filled),
        strlen((string) $of),
        $at + 1,
        $of,
    );
}

/**
 * @param  list<string>  $files
 */
function move(string $given, string $qualified, array $files, bool $dry, string $scope = '', string $progress = ''): bool
{
    $new = basename(str_replace('\\', '/', $qualified));
    $where = declaredIn($given, $files, $scope);

    if ($where === null) {
        return false;
    }

    // the source may have been given fully qualified to settle an ambiguous name; everything below
    // works on the short name, and the namespace it came from is the one the file already declares
    $old = shortNameOf($given);

    $to = destination($where, $qualified);

    if ($to !== $where && file_exists($to)) {
        printf("  %s → %s  SKIPPED: %s already exists\n", $old, $qualified, relative($to));

        return false;
    }
    $from = namespaceOf($where).'\\'.$old;
    $onward = namespaceOf($to).'\\'.$new;

    $pending = [];
    $taken = [];
    $naming = [];
    $rewritten = rewrite($files, $from, $onward, $old, $new, $dry, $pending, [$where, $to], $naming);
    $imported = imports($files, $onward, $new, [$where, $to], $dry, $pending, $taken, $naming);

    // the moved file leaves its neighbours behind, and it named them without an import because they
    // stood beside it — each of those now needs one, or the class resolves under its NEW namespace
    $pending[$where] = keepingNeighbours($pending[$where] ?? file_get_contents($where), $where, $to);

    $refused = unparsable($pending);

    if ($refused !== []) {
        printf("  %s → %s  REFUSED: it would not parse\n", $old, $qualified);

        foreach ($refused as $file => $why) {
            printf("      %s: %s\n", relative($file), $why);
        }

        return false;
    }

    if (! $dry) {
        foreach ($pending as $file => $body) {
            file_put_contents($file, $body);
        }

        namespaced($where, $to);
    }

    printf(
        "%s %s → %s%s\n      %d reference(s) repointed, %d import(s) added\n",
        $progress === '' ? ' ' : $progress,
        $old,
        $qualified,
        $where === $to ? '' : '  ('.relative($to).')',
        $rewritten,
        $imported,
    );

    foreach ($taken as $file) {
        printf("      NAME TAKEN, qualified instead: %s\n", $file);
    }

    return true;
}

/**
 * Point every reference at a class that already exists, and delete the one it replaced.
 *
 * The only difference from a move is where the destination comes from: a move invents it from the
 * name it was given, a replace looks it up and refuses if nothing declares it. Everything after
 * that is the same repoint, so a replace is proven to parse before anything is written, exactly as
 * a move is.
 *
 * @param  list<string>  $files
 */
function replace(string $given, string $qualified, array $files, bool $dry, string $scope = '', string $progress = ''): bool
{
    $new = basename(str_replace('\\', '/', $qualified));
    $where = declaredIn($given, $files, $scope);

    if ($where === null) {
        return false;
    }

    $kept = declaredIn($qualified, $files);

    if ($kept === null) {
        printf("  %s → %s  REFUSED: nothing declares %s, so there is nothing to replace it with\n", $given, $qualified, $qualified);

        return false;
    }

    $old = shortNameOf($given);
    $from = namespaceOf($where).'\\'.$old;
    $onward = namespaceOf($kept).'\\'.$new;

    if ($from === $onward) {
        printf("  %s → %s  SKIPPED: they are the same class\n", $old, $qualified);

        return false;
    }

    $pending = [];
    $taken = [];
    $naming = [];
    $rewritten = rewrite($files, $from, $onward, $old, $new, $dry, $pending, [$where, $kept], $naming);
    $imported = imports($files, $onward, $new, [$where, $kept], $dry, $pending, $taken, $naming);

    // a replace can repoint an import onto one the file ALREADY has, and PHP fatals on the second
    $pending = array_map(deduplicated(...), $pending);

    // the replaced file is deleted, so whatever the repoint did to its own body is never written
    unset($pending[$where]);

    $refused = unparsable($pending);

    if ($refused !== []) {
        printf("  %s → %s  REFUSED: it would not parse\n", $old, $qualified);

        foreach ($refused as $file => $why) {
            printf("      %s: %s\n", relative($file), $why);
        }

        return false;
    }

    if (! $dry) {
        foreach ($pending as $file => $body) {
            file_put_contents($file, $body);
        }

        deleted($where);
    }

    printf(
        "%s %s → %s  (%s deleted)\n      %d reference(s) repointed, %d import(s) added\n",
        $progress === '' ? ' ' : $progress,
        $old,
        $qualified,
        relative($where),
        $rewritten,
        $imported,
    );

    foreach ($taken as $file) {
        printf("      NAME TAKEN, qualified instead: %s\n", $file);
    }

    return true;
}

/**
 * Repoint every reference: the fully-qualified name first, so a rename of the short name afterwards
 * cannot touch the namespace it already sits in.
 *
 * @param  list<string>  $files
 * @param  array<string, string>  $pending  what each file will hold, so a dry run reports what a real one does
 */
function rewrite(array $files, string $from, string $onward, string $old, string $new, bool $dry, array &$pending, array $declaring = [], array &$naming = []): int
{
    $touched = 0;

    foreach ($files as $file) {
        $was = $pending[$file] ?? file_get_contents($file);
        $ours = meansOurs($file, $was, $from, $old, $declaring);

        // what this file will CALL the class, decided before anything is written: a file that already
        // means another class by the new name calls ours by as much of its namespace as tells them
        // apart, and that is the name written in — renaming to the bare one first would collide
        $calls = $ours && ! in_array($file, $declaring, true) && clashes($was, $new, $from, $onward, $file, $declaring[0] ?? '')
            ? qualifying($was, $onward, $new)
            : ['import' => $onward, 'named' => $new];

        if ($ours) {
            $naming[$file] = $calls;
        }

        // a name said IN FULL becomes the new full name, whatever this file will call it in its body.
        // Qualifying here would reach inside `use` lines, where a name is absolute and a relative one
        // resolves to nothing — `use Protocol\Wire as SceneWire;` parses, and means `\Protocol\Wire`
        $now = repointed($was, $from, $onward);

        if ($old !== $new && $ours) {
            $now = renamed($now, $old, $calls['named']);
        }

        if ($now === $was) {
            continue;
        }

        $touched++;
        $pending[$file] = $now;

    }

    return $touched;
}

/**
 * Imports for what the moved file used to stand beside. A class in the same namespace is named without
 * an import; carried into another namespace that name resolves there instead — to nothing, usually, and
 * to the WRONG class when the new namespace happens to hold one by that name.
 */
function keepingNeighbours(string $source, string $where, string $to): string
{
    $was = namespaceOf($where);

    if ($was === namespaceOf($to)) {
        return $source;
    }

    $body = $source;

    foreach (declaredUnder(substr($was, strlen(PACKAGE))) as $neighbour) {
        if (! names($body, $neighbour) || bound($body, $neighbour)) {
            continue;
        }

        $body = importing($body, $was.'\\'.$neighbour);
    }

    return $body;
}

/**
 * Every file the move would leave unparsable. Nothing is written until this comes back empty, so a move
 * that would break the tree leaves it exactly as it was rather than half-applied.
 *
 * @param  array<string, string>  $pending
 * @return array<string, string>
 */
function unparsable(array $pending): array
{
    $refused = [];

    foreach ($pending as $file => $body) {
        // parsed HERE rather than by a `php -l` in a process of its own. The check is the same one —
        // TOKEN_PARSE runs the real parser and throws on what it will not read — and a move touches
        // hundreds of files, so a process apiece was the whole cost of a run
        try {
            token_get_all($body, TOKEN_PARSE);
        } catch (ParseError $refusal) {
            $refused[$file] = $refusal->getMessage().' on line '.$refusal->getLine();
        }
    }

    return $refused;
}

/**
 * Whether the SHORT name, written in this file, means the class being moved. A file means it when it
 * declares it, imports it, or stands beside it in the same namespace and imports no other class by that
 * name — the three ways PHP resolves an unqualified name.
 *
 * Anywhere else the short name means something else, and renaming it there is how a move once renamed
 * an Engine validation rule that merely shared a name with the attribute being moved. A file that means
 * another class by the name cannot ALSO name ours unqualified, so its reference to ours is fully
 * qualified and the replacement above has already repointed it exactly.
 *
 * @param  list<string>  $declaring  where the class is now and where it is going
 */
function meansOurs(string $file, string $body, string $from, string $old, array $declaring): bool
{
    if (in_array($file, $declaring, true)) {
        return true;
    }

    if (str_contains($body, 'use '.$from.';') || str_contains($body, 'use '.$from.' as ')) {
        return true;
    }

    $namespace = substr($from, 0, strrpos($from, '\\'));

    return namespaceOf($file) === $namespace && ! bound($body, $old);
}

/**
 * A class leaving its namespace takes its former neighbours' implicit reference with it — they named it
 * without an import because it stood beside them. Give each of them the import it now needs.
 *
 * @param  list<string>  $files
 * @param  list<string>  $declaring  where the class is now and where it came from
 * @param  array<string, string>  $pending  what each file will hold, so a dry run reports what a real one does
 */
function imports(array $files, string $onward, string $new, array $declaring, bool $dry, array &$pending, array &$taken, array $naming = []): int
{
    $namespace = namespaceOf($declaring[1]);
    $added = 0;

    foreach ($files as $file) {
        if (in_array($file, $declaring, true) || namespaceOf($file) === $namespace) {
            continue;
        }

        $body = $pending[$file] ?? file_get_contents($file);

        // an import already reaching it needs nothing added — including one under an ALIAS, which is how
        // a file that means another class by the short name reached it before the move, and still does
        if (! names($body, $new) || str_contains($body, 'use '.$onward.';') || str_contains($body, 'use '.$onward.' as ')) {
            continue;
        }

        // a file that merely says the word is not a file that means it
        if (! isset($naming[$file])) {
            continue;
        }

        $calls = $naming[$file];

        if ($calls['import'] === '' || str_contains($body, 'use '.$calls['import'].';')) {
            continue;
        }

        if ($calls['named'] !== $new) {
            $taken[] = relative($file).' → '.$calls['named'];
        }

        $added++;
        $pending[$file] = importing($body, $calls['import']);

    }

    return $added;
}

/**
 * How to name a class in a file that already means something else by its short name. PHP lets an import
 * stop short of the class: `use A\B\Pipeline;` makes `Pipeline\Transition` name it, and that reads as
 * what it is rather than as an alias somebody invented.
 *
 * One segment is taken at a time until the leading one is free too, so a file holding three classes of
 * one name still ends up with three names that say where each comes from.
 *
 * @return array{import: string, named: string}
 */
function qualifying(string $body, string $onward, string $new): array
{
    $segments = explode('\\', $onward);

    array_pop($segments);

    for ($taken = 1; $taken < count($segments); $taken++) {
        $leading = $segments[count($segments) - $taken];
        $named = implode('\\', array_slice($segments, -$taken)).'\\'.$new;

        if (! bound($body, $leading) && ! str_contains($body, 'use '.$named.';')) {
            return ['import' => implode('\\', array_slice($segments, 0, count($segments) - $taken + 1)), 'named' => $named];
        }
    }

    // nothing short of the whole name tells them apart, so the whole name is what it is called
    return ['import' => '', 'named' => '\\'.$onward];
}

/**
 * Whether the short name means something OTHER than the class being moved in this file. Its own import
 * does not count: a move keeps the name, so a file importing it would otherwise look like a clash with
 * itself and be qualified for no reason.
 */
function clashes(string $body, string $new, string $from, string $onward, string $file, string $leaving): bool
{
    $without = str_replace(['use '.$from.';', 'use '.$onward.';'], '', $body);

    return bound($without, $new) || beside($file, $new, $leaving);
}

/**
 * Whether the file's own namespace already declares the short name. A class standing beside it needs no
 * import to be named, so one added here would point every mention at the wrong class.
 */
function beside(string $file, string $class, string $leaving = ''): bool
{
    $path = dirname($file).'/'.$class.'.php';

    // the class being moved is on its way OUT of that directory, so it is no longer a neighbour
    return $path !== $leaving && is_file($path);
}

/**
 * Whether the short name already stands for something in this file — another import of the same name,
 * an alias onto it, or a declaration of it. Adding a second binding would not compile.
 */
function bound(string $body, string $class): bool
{
    $name = preg_quote($class, '/');

    if (imported($body, $class)) {
        return true;
    }

    foreach (['/\bas\s+'.$name.'\s*;/m', '/\b(?:class|interface|trait|enum)\s+'.$name.'\b/'] as $pattern) {
        if (preg_match($pattern, $body)) {
            return true;
        }
    }

    return false;
}

/**
 * Whether the file IMPORTS a class of this name. An import stands at the top level; a `use` inside a
 * class body names a TRAIT, and reading one as the other is what made a former neighbour look like it
 * already meant some other class by the name — so the move skipped it and left the old name behind.
 */
function imported(string $body, string $class): bool
{
    $tokens = token_get_all($body);
    $depth = 0;
    $importing = false;
    $last = '';

    foreach ($tokens as $token) {
        if (! is_array($token)) {
            if ($token === '{') {
                $depth++;
            }
            if ($token === '}') {
                $depth--;
            }

            if ($token === ';' && $importing) {
                $importing = false;

                if ($last === $class) {
                    return true;
                }
            }

            continue;
        }

        if ($token[0] === T_CURLY_OPEN || $token[0] === T_DOLLAR_OPEN_CURLY_BRACES) {
            $depth++;

            continue;
        }

        if ($token[0] === T_USE && $depth === 0) {
            $importing = true;
            $last = '';

            continue;
        }

        if ($importing && ($token[0] === T_STRING || $token[0] === T_NAME_QUALIFIED)) {
            $segments = explode('\\', $token[1]);
            $last = end($segments);
        }
    }

    return false;
}

/**
 * Whether the body names the class the way a reference to it is written. PHP's own lexer answers this:
 * a string body and a comment are their own tokens, a qualified name like `Storage\EloquentStore` is
 * one token that is not the class, and a member like `ClientAction::Scroll` follows a `::`.
 */
function names(string $body, string $class): bool
{
    $tokens = token_get_all($body);
    $importing = false;
    $depth = 0;

    foreach ($tokens as $at => $token) {
        if (! is_array($token)) {
            if ($token === '{') {
                $depth++;
            }
            if ($token === '}') {
                $depth--;
            }
            if ($token === ';') {
                $importing = false;
            }

            continue;
        }

        // an interpolation opens with a token of its own and closes with a plain brace, so it is
        // counted here too or the depth drifts below where it started
        if ($token[0] === T_CURLY_OPEN || $token[0] === T_DOLLAR_OPEN_CURLY_BRACES) {
            $depth++;

            continue;
        }

        // an IMPORT stands at the top level. A `use` inside a class body names a TRAIT, and a trait is
        // referred to by name like anything else — skipping it left the old name behind in the one
        // place a move could not see it.
        if (($token[0] === T_USE && $depth === 0) || $token[0] === T_NAMESPACE) {
            $importing = true;

            continue;
        }

        if ($importing || $token[0] !== T_STRING || $token[1] !== $class) {
            continue;
        }

        if (member($tokens, $at) || declares($tokens, $at)) {
            continue;
        }

        return true;
    }

    return false;
}

/**
 * Whether the token at this position is the name being DECLARED — `case Transition = …` in an enum,
 * `function transition()`, `const Transition` — rather than a reference to a class of that name.
 *
 * @param  list<array{0: int, 1: string}|string>  $tokens
 */
function declares(array $tokens, int $at): bool
{
    foreach (before($tokens, $at) as $token) {
        return in_array($token[0], [T_CASE, T_FUNCTION, T_CONST, T_CLASS, T_INTERFACE, T_TRAIT, T_ENUM], true);
    }

    return false;
}

/**
 * Whether the token at this position hangs off something else — `Other::Name`, `$it->Name` — rather
 * than naming a class in its own right.
 *
 * @param  list<array{0: int, 1: string}|string>  $tokens
 */
function member(array $tokens, int $at): bool
{
    foreach (before($tokens, $at) as $token) {
        return in_array($token[0], [T_DOUBLE_COLON, T_OBJECT_OPERATOR, T_NULLSAFE_OBJECT_OPERATOR], true);
    }

    return false;
}

/**
 * The significant token before this one — whitespace and comments passed over — as a one-step generator,
 * so a caller reads it with `foreach` and gets nothing at all when the token opens the file.
 *
 * @param  list<array{0: int, 1: string}|string>  $tokens
 * @return Generator<array{0: int, 1: string}>
 */
function before(array $tokens, int $at): Generator
{
    for ($before = $at - 1; $before >= 0; $before--) {
        $token = $tokens[$before];

        if (is_array($token) && in_array($token[0], [T_WHITESPACE, T_COMMENT, T_DOC_COMMENT], true)) {
            continue;
        }

        yield is_array($token) ? $token : [-1, $token];

        return;
    }
}

/**
 * Writes the import in, after the last one already there, or after the namespace when there is none.
 */
function importing(string $body, string $onward): string
{
    $lines = explode("\n", $body);
    $at = null;

    foreach ($lines as $index => $line) {
        if (str_starts_with($line, 'use ')) {
            $at = $index;

            continue;
        }

        if ($at === null && str_starts_with($line, 'namespace ')) {
            $at = $index + 1;
        }
    }

    if ($at === null) {
        return $body;
    }

    array_splice($lines, $at + 1, 0, 'use '.$onward.';');

    return implode("\n", $lines);
}

/**
 * Where the class is declared, or null when nothing declares it. A short name can be declared more than
 * once across the tree — `Instant` is a modifier and a contract — so a scope narrows the search to the
 * namespace the class is being taken from.
 *
 * @param  list<string>  $files
 *
 * The one file declaring this class. A name that several files declare is REFUSED rather than guessed
 * at: picking the first renamed a class nobody asked about — and because every reference to the one
 * that WAS asked about had been repointed, `No dangling references` still reported clean.
 *
 * A fully-qualified name settles it, and so does `--namespace=`.
 * @param  list<string>  $files
 *
 * The body with every mention of the bare short name renamed.
 *
 * Three things it must not touch. A member reached through `::` — `Tag::Surface` is an enum case that
 * happens to share the name — while `Surface::class` IS renamed, because there the name leads the `::`
 * rather than following it. And either side of a `\`, which makes it a segment of somebody else's
 * fully-qualified name: moving `Scene\Scripts\Confirmations` once rewrote every
 * `Scene\Confirmations\Confirmable` in the tree to a namespace that does not exist. The full name was
 * repointed before this runs, so anything still wearing a backslash belongs to someone else.
 *
 * And either side of a `/`, which makes it a segment of a FILE PATH rather than an identifier: moving
 * `Ui\Client\Client` once rewrote `'src/Ui/Client/ScriptCompiler.php'` inside a `#[MustFailWhen]` to a
 * directory that does not exist, and the run reported no dangling references because a path is not one.
 */
function renamed(string $body, string $old, string $new): string
{
    $pattern = '/(?<!::)(?<!\\\\)(?<!\\/)\b'.preg_quote($old, '/').'\b(?!\\\\)(?!\\/)/';

    return implode('', array_map(
        static fn (array $run): string => $run[1] ? $run[0] : (string) preg_replace($pattern, $new, $run[0]),
        literals($body),
    ));
}

/**
 * The body split into runs, each said to be a string literal or not.
 *
 * A bare word inside a quoted string is prose, not an identifier: moving `Search` once rewrote
 * `placeholder('Search workflows…')` in nine files to `'SearchField workflows…'`, and the run
 * reported no dangling references because a placeholder is not one. A name said in full inside a
 * string IS repointed, by `repointed`, which runs first and does not come through here.
 *
 * @return list<array{0: string, 1: bool}>
 */
function literals(string $body): array
{
    $prefixed = str_starts_with(ltrim($body), '<?php');
    $tokens = @token_get_all($prefixed ? $body : '<?php '.$body);
    $quoted = [T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE, T_INLINE_HTML];
    $runs = [];

    foreach ($tokens as $index => $token) {
        if (! $prefixed && $index === 0) {
            continue;
        }

        $text = is_array($token) ? $token[1] : $token;
        $literal = is_array($token) && in_array($token[0], $quoted, true);
        $last = array_key_last($runs);

        if ($last !== null && $runs[$last][1] === $literal) {
            $runs[$last][0] .= $text;

            continue;
        }

        $runs[] = [$text, $literal];
    }

    return $runs;
}

/**
 * A name said IN FULL, repointed at where the class went. It must stop at the END of the name:
 * moving `A\B\Refusal` once rewrote every `A\B\Refusals` in the tree to a class that does not
 * exist, and moving `A\B\Node` would do the same to `A\B\Node\Card`.
 */
function repointed(string $body, string $from, string $onward): string
{
    return (string) preg_replace_callback(
        '/'.preg_quote($from, '/').'(?![\\\\A-Za-z0-9_])/',
        static fn (): string => $onward,
        $body,
    );
}

/**
 * The body with every repeated top-level import struck, keeping the first.
 *
 * A move points the one import at a name nothing else in the file uses, so it can never make a pair.
 * A replace can: the file already imported the class being kept, and repointing the retiring one
 * lands a second `use` of the same name -- which PARSES, so the parse check clears it, and PHP then
 * fatals on "cannot use X as X because the name is already in use". An import inside a class body is
 * a trait and an import inside a signature is a closure's; both are indented, and only a line
 * standing at the left margin is read here.
 */
function deduplicated(string $body): string
{
    $seen = [];

    $kept = array_filter(
        explode("\n", $body),
        static function (string $line) use (&$seen): bool {
            if (preg_match('/^use\s+[^\s;]+(\s+as\s+\w+)?;$/', $line) !== 1) {
                return true;
            }

            $repeated = isset($seen[$line]);
            $seen[$line] = true;

            return ! $repeated;
        },
    );

    return implode("\n", $kept);
}

function shortNameOf(string $class): string
{
    return basename(str_replace('\\', '/', $class));
}

function declaredIn(string $class, array $files, string $scope = ''): string|null
{
    $wanted = basename(str_replace('\\', '/', $class));
    $under = str_contains($class, '\\') ? PACKAGE.trim(substr($class, 0, strrpos($class, '\\')), '\\') : '';
    $found = [];

    foreach ($files as $file) {
        // a scope is the tree beneath it, so a class in one of its sub-namespaces is still under it
        if ($scope !== '' && ! isUnder(namespaceOf($file), PACKAGE.$scope)) {
            continue;
        }

        if ($under !== '' && namespaceOf($file) !== $under) {
            continue;
        }

        if (preg_match('/^\s*(final\s+|abstract\s+|readonly\s+)*(class|interface|trait|enum)\s+'.preg_quote($wanted, '/').'\b/m', file_get_contents($file))) {
            $found[] = $file;
        }
    }

    if (count($found) > 1) {
        printf("  AMBIGUOUS: %d classes are named [%s]. Say which by its full name, or pass --namespace=\n", count($found), $wanted);

        foreach ($found as $one) {
            printf("      %s\n", relative($one));
        }

        return null;
    }

    return $found[0] ?? null;
}

/**
 * The path the file ends up at: beside itself for a rename, and otherwise wherever the NAMESPACE
 * says, which is the exact inverse of {@see namespaceOf()}.
 */
function destination(string $from, string $qualified): string
{
    if (! str_contains($qualified, '\\')) {
        return dirname($from).'/'.basename(str_replace('\\', '/', $qualified)).'.php';
    }

    foreach (roots() as $namespace => $folder) {
        if (str_starts_with($qualified, $namespace)) {
            return ROOT.'/'.$folder.'/'.str_replace('\\', '/', substr($qualified, strlen($namespace))).'.php';
        }
    }

    fwrite(STDERR, "{$qualified} is under no PSR-4 root of composer.json, so it has no folder.\n");

    exit(2);
}

/**
 * The PSR-4 roots of composer.json, namespace to folder, the longest folder first so a nested root wins.
 *
 * @return array<string, string>
 */
function roots(): array
{
    static $roots = null;

    if ($roots !== null) {
        return $roots;
    }

    $composer = json_decode((string) file_get_contents(ROOT.'/composer.json'), true, flags: JSON_THROW_ON_ERROR);
    $roots = array_map(static fn (string $folder): string => rtrim($folder, '/'), [...$composer['autoload']['psr-4'], ...$composer['autoload-dev']['psr-4']]);
    uasort($roots, static fn (string $one, string $other): int => strlen($other) <=> strlen($one));

    return $roots;
}

/**
 * Move the file and put its namespace right.
 */
function namespaced(string $from, string $to): void
{
    if ($from === $to) {
        return;
    }

    if (! is_dir(dirname($to))) {
        mkdir(dirname($to), 0755, true);
    }

    exec(sprintf('git -C %s mv %s %s 2>/dev/null', escapeshellarg(ROOT), escapeshellarg($from), escapeshellarg($to)), $out, $status);

    if ($status !== 0) {
        rename($from, $to);
    }

    $namespace = namespaceOf($to);
    $body = file_get_contents($to);

    file_put_contents($to, preg_replace('/^namespace\s+[^;]+;/m', 'namespace '.$namespace.';', $body, 1));
}

/**
 * Take the replaced file out of the tree, and the directory with it when it held nothing else — a
 * namespace left with no classes in it is a name the next reader has to look inside to dismiss.
 */
function deleted(string $file): void
{
    exec(sprintf('git -C %s rm -q %s 2>/dev/null', escapeshellarg(ROOT), escapeshellarg($file)), $out, $status);

    if ($status !== 0) {
        unlink($file);
    }

    @rmdir(dirname($file));
}

/**
 * Read from the path below the project root, never by searching the whole path for `/app/`: inside the
 * container the project root itself is `/app`.
 */
function namespaceOf(string $file): string
{
    $path = relative($file);

    foreach (roots() as $namespace => $folder) {
        if (str_starts_with($path, $folder.'/')) {
            return rtrim($namespace.str_replace('/', '\\', dirname(substr($path, strlen($folder) + 1))), '\\.');
        }
    }

    // routes, config and bootstrap files lie under no root and declare no namespace
    return '';
}

/**
 * @return list<string>
 */
function sources(): array
{
    $found = [];

    foreach (SEARCHED as $where) {
        // a root that is not there would narrow the scan in silence, and a narrowed scan is how a move
        // leaves a reference pointing at a namespace the class has left
        if (! is_dir(ROOT.'/'.$where)) {
            throw SearchedFolderMissing::for($where);
        }

        $walk = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(ROOT.'/'.$where, FilesystemIterator::SKIP_DOTS));

        foreach ($walk as $file) {
            $path = $file->getPathname();

            if ($file->getExtension() !== 'php') {
                continue;
            }

            foreach (SKIPPED as $skip) {
                if (str_contains($path, '/'.$skip.'/')) {
                    continue 2;
                }
            }

            $found[] = $path;
        }
    }

    return $found;
}

/**
 * @return list<string>
 */
function listed(string $path): array
{
    $lines = file(str_starts_with($path, '/') ? $path : ROOT.'/'.$path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    return array_values(array_filter(array_map(
        static fn (string $line): string => trim(explode('#', $line)[0]),
        $lines ?: [],
    )));
}

function relative(string $path): string
{
    return str_replace(tidy(ROOT).'/', '', tidy($path));
}

/**
 * Resolves `.` and `..` without touching the filesystem, so a path that does not exist yet — the
 * destination of a dry run — still prints as itself.
 */
function tidy(string $path): string
{
    $parts = [];

    foreach (explode('/', $path) as $step) {
        if ($step === '' || $step === '.') {
            continue;
        }

        if ($step === '..') {
            array_pop($parts);

            continue;
        }

        $parts[] = $step;
    }

    return '/'.implode('/', $parts);
}

/**
 * Whether a namespace IS another or sits beneath it. `Scene\Client` is under `Scene\Client`, and so is
 * `Scene\Client\Protocol` — but `Scene\ClientRun` is not, which is why the separator is part of the
 * question.
 */
function isUnder(string $namespace, string $root): bool
{
    return $namespace === $root || str_starts_with($namespace, $root.'\\');
}

/**
 * Every class, interface, trait and enum declared under a namespace, named RELATIVE to it — so one
 * declared in a sub-namespace answers `Primitives\Drag` rather than `Drag`.
 *
 * It reaches all the way down, because a namespace is the tree beneath it and not merely the classes
 * sitting directly in it. Moving `Renderer\Modifiers` and getting the eleven classes at its top while
 * leaving fifty in its sub-namespaces behind is a half-applied move that still reports success.
 *
 * @return list<string>
 */
function declaredUnder(string $namespace): array
{
    $full = PACKAGE.$namespace;
    $names = [];

    foreach (sources() as $file) {
        $declares = namespaceOf($file);

        if (! isUnder($declares, $full)) {
            continue;
        }

        if (preg_match('/^\s*(?:final\s+|abstract\s+|readonly\s+)*(?:class|interface|trait|enum)\s+([A-Za-z0-9_]+)/m', file_get_contents($file), $found)) {
            $under = $declares === $full ? '' : substr($declares, strlen($full) + 1).'\\';

            $names[] = $under.$found[1];
        }
    }

    sort($names);

    return $names;
}

/**
 * Every reference left pointing at a name nothing declares any more — what a half-applied move leaves
 * behind, and the one thing worth failing on.
 *
 * @param  list<string>  $was
 * @param  list<string>  $files
 * @return array<string, list<string>>
 *
 * Whether `$source` names the class `$qualified`, and not one whose name merely BEGINS with it. A
 * plain `str_contains` reported every file naming `WorkflowProblemsLoader` as still naming the
 * `WorkflowProblems` it was renamed from — a dangling reference that was not there, on a move that
 * had applied cleanly.
 */
function namesClass(string $source, string $qualified): bool
{
    return preg_match('/'.preg_quote($qualified, '/').'(?![A-Za-z0-9_\\\\])/', $source) === 1;
}

function dangling(array $was, array $files): array
{
    $left = [];

    foreach (array_unique($was) as $gone) {
        foreach ($files as $file) {
            if (! namesClass(file_get_contents($file), $gone)) {
                continue;
            }

            $left[$gone][] = relative($file);
        }
    }

    return $left;
}

/**
 * @param  array<string, list<string>>  $left
 */
function report(array $left): void
{
    if ($left === []) {
        echo "No dangling references.\n";

        return;
    }

    echo "\nDANGLING REFERENCES — these still name a class that moved:\n";

    foreach ($left as $gone => $files) {
        printf("  %s\n", $gone);

        foreach ($files as $file) {
            printf("      %s\n", $file);
        }
    }
}

/**
 * What `names()` must and must not count as a reference. Every case here is one this tool got wrong on
 * real code: each is a shape that cost a broken move before it was understood.
 *
 * @return list<array{0: string, 1: string, 2: string, 3: bool}>
 */
function cases(): array
{
    return [
        ['a qualified name is one token, and is not the class', '$app->scoped(Store::class, Storage\EloquentStore::class);', 'Storage', false],
        ['a member of something else', 'assertSame([ClientAction::Scroll->value], $x);', 'Scroll', false],
        ['inside a single-quoted string', "preg_match('/(?:Acts|ClientAction)::/', \$w);", 'ClientAction', false],
        ['inside a docblock', '/** ClientAction::Mount */ $x = 1;', 'ClientAction', false],
        ['part of a longer word', 'class FailedStepScrollTest {}', 'Scroll', false],
        ['a glob opening what looks like a comment', "foreach (glob(\$this->at(X).'/*.ts') as \$f) {} // ClientAction", 'ClientAction', false],
        ['only named by a use line', 'use Other\Scroll; $y = 1;', 'Scroll', false],
        ['an enum case being declared', 'enum ClientMark: string { case Transition = \'data-transition\'; }', 'Transition', false],
        ['a method being declared', 'class A { public function transition(): int {} }', 'transition', false],
        ['new', 'return new Scroll;', 'Scroll', true],
        ['a return type', 'function s(): Scroll {}', 'Scroll', true],
        ['::class', '$x = Scroll::class;', 'Scroll', true],
        ['an attribute argument', '#[Style(Layout::Row)] class A {}', 'Layout', true],
        ['a nullable parameter type', 'function f(?Scroll $s) {}', 'Scroll', true],
        ['extends', 'class A extends Scroll {}', 'Scroll', true],
        ['a trait used inside a class body', 'class A { use Scroll; }', 'Scroll', true],
        ['several traits used at once', 'class A { use Holds, Scroll; }', 'Scroll', true],
    ];
}

/**
 * What counts as being under a namespace. This was read as an EXACT match once, and a move of
 * `Scene\Client\Protocol` took the eight classes sitting at its top, left the thirty-five in its
 * sub-namespaces where they were, and reported success — which is the half-applied move this whole
 * tool exists to make impossible.
 *
 * @return list<array{0: string, 1: string, 2: string, 3: bool}>
 *
 * What repointing the FULL name must and must not touch.
 * @return list<array{0: string, 1: string, 2: string, 3: string, 4: string}>
 */
function repoints(): array
{
    return [
        ['the name itself', 'use A\B\Refusal;', 'A\B\Refusal', 'A\Refusal', 'use A\Refusal;'],
        ['a longer name beginning the same way', 'use A\B\Refusals;', 'A\B\Refusal', 'A\Refusal', 'use A\B\Refusals;'],
        ['a sub-namespace of it', 'use A\B\Node\Card;', 'A\B\Node', 'A\Node', 'use A\B\Node\Card;'],
        ['a name it merely ends with', 'use Other\A\B\Refusal;', 'A\B\Refusal', 'A\Refusal', 'use Other\A\Refusal;'],
        ['every occurrence in one body', 'A\B\Refusal::X; A\B\Refusal::Y;', 'A\B\Refusal', 'A\Refusal', 'A\Refusal::X; A\Refusal::Y;'],
    ];
}

/**
 * What renaming the bare short name must and must not touch.
 *
 * @return list<array{0: string, 1: string, 2: string, 3: string, 4: string}>
 */
function rewrites(): array
{
    return [
        ['a namespace segment sharing the name', 'use A\Confirmations\Confirmable;', 'Confirmations', 'ConfirmationScripts', 'use A\Confirmations\Confirmable;'],
        ['the last segment of somebody else\'s name', 'use A\B\Confirmations;', 'Confirmations', 'ConfirmationScripts', 'use A\B\Confirmations;'],
        ['a member reached through ::', '$x = Tag::Confirmations;', 'Confirmations', 'ConfirmationScripts', '$x = Tag::Confirmations;'],
        ['the bare name in the body', 'new Confirmations($a);', 'Confirmations', 'ConfirmationScripts', 'new ConfirmationScripts($a);'],
        ['the bare name leading ::class', '$x = Confirmations::class;', 'Confirmations', 'ConfirmationScripts', '$x = ConfirmationScripts::class;'],
        ['a longer word merely containing it', 'class ConfirmationsTest {}', 'Confirmations', 'ConfirmationScripts', 'class ConfirmationsTest {}'],
        ['a segment of a file path', "file: 'src/Ui/Confirmations/Thing.php',", 'Confirmations', 'ConfirmationScripts', "file: 'src/Ui/Confirmations/Thing.php',"],
        ['a path segment at the end', "'src/Ui/Confirmations'", 'Confirmations', 'ConfirmationScripts', "'src/Ui/Confirmations'"],
        ['a bare word inside a string literal', "placeholder('Confirmations are due')", 'Confirmations', 'ConfirmationScripts', "placeholder('Confirmations are due')"],
        ['a bare word inside a double-quoted string', '$x = "a Confirmations line";', 'Confirmations', 'ConfirmationScripts', '$x = "a Confirmations line";'],
        ['the name in a docblock', '/** A Confirmations script. */', 'Confirmations', 'ConfirmationScripts', '/** A ConfirmationScripts script. */'],
    ];
}

/**
 * Where a namespace lives. The root is read from the NAME and never from where the file was, because
 * the two are only inverses if one rule decides both: a test class named under `Tests\` used to take
 * its root from its old path and land at `tests/Tests/...`, one directory deeper every move.
 *
 * @return list<array{0: string, 1: string, 2: string, 3: string}>
 */
function destinations(): array
{
    return [
        ['a rename stays beside itself', ROOT.'/app/Core/Hooks/AgentStacks.php', 'Stacks', ROOT.'/app/Core/Hooks/Stacks.php'],
        ['a move under app', ROOT.'/app/Core/Hooks/AgentStacks.php', 'App\\Core\\Hooks\\Stack\\AgentStacks', ROOT.'/app/Core/Hooks/Stack/AgentStacks.php'],
        ['a test class under tests', ROOT.'/tests/Support/HookDatabase.php', 'Tests\\Support\\Database\\HookDatabase', ROOT.'/tests/Support/Database/HookDatabase.php'],
        ['a test class renamed in place', ROOT.'/tests/Feature/AgentVisibilityTest.php', 'VisibilityTest', ROOT.'/tests/Feature/VisibilityTest.php'],
        ['a name merely beginning with Tests', ROOT.'/app/A.php', 'App\\Testsuite\\Runner', ROOT.'/app/Testsuite/Runner.php'],
        ['a fixture promoted out of tests', ROOT.'/tests/Fixtures/Hooks/ScriptedState.php', 'App\\Core\\Hooks\\ScriptedState', ROOT.'/app/Core/Hooks/ScriptedState.php'],
    ];
}

function scopes(): array
{
    return [
        ['the namespace itself', 'Scene\Client', 'Scene\Client', true],
        ['a sub-namespace', 'Scene\Client\Protocol', 'Scene\Client', true],
        ['one several levels down', 'Scene\Client\Protocol\Primitives', 'Scene\Client', true],
        ['a longer name that merely begins the same way', 'Scene\ClientRun', 'Scene\Client', false],
        ['the namespace above it', 'Scene', 'Scene\Client', false],
        ['a sibling', 'Scene\Server', 'Scene\Client', false],
    ];
}

/**
 * What the parse guard must and must not refuse. It is the last thing standing between a bad rewrite
 * and a broken tree — a move writes nothing unless every file it would touch parses — so it is worth
 * proving it still says no.
 *
 * @return list<array{0: string, 1: string, 2: bool}>
 * @return list<array{0: string, 1: string, 2: string, 3: bool}>
 */
function naming(): array
{
    return [
        ['the class itself', 'use A\\B\\Problems;', 'A\\B\\Problems', true],
        ['a longer class beginning with it', 'use A\\B\\ProblemsLoader;', 'A\\B\\Problems', false],
        ['a deeper namespace beginning with it', 'use A\\B\\Problems\\Row;', 'A\\B\\Problems', false],
        ['the name leading ::class', '$x = A\\B\\Problems::class;', 'A\\B\\Problems', true],
    ];
}

/**
 * @return list<array{string, string, string}>
 */
function duplicates(): array
{
    return [
        ['a repeated import', "<?php\nuse A\\B;\nuse A\\B;\n\n\$x = new B;", "<?php\nuse A\\B;\n\n\$x = new B;"],
        ['two different imports', "<?php\nuse A\\B;\nuse A\\C;\n", "<?php\nuse A\\B;\nuse A\\C;\n"],
        ['a repeated aliased import', "<?php\nuse A\\B as C;\nuse A\\B as C;\n", "<?php\nuse A\\B as C;\n"],
        ['a trait used twice in one class', "<?php\nfinal class A\n{\n    use Loud;\n    use Loud;\n}", "<?php\nfinal class A\n{\n    use Loud;\n    use Loud;\n}"],
    ];
}

function parses(): array
{
    return [
        ['a class', "<?php\nfinal class A { public function b(): void {} }", true],
        ['an import and a use of it', "<?php\nuse A\\B\\C;\n\$x = new C;", true],
        ['an aliased import', "<?php\nuse A\\B\\C as D;\n\$x = new D;", true],
        ['a class left open', "<?php\nfinal class A {", false],
        ['a statement missing its semicolon', "<?php\n\$x = 1\n\$y = 2;", false],
        ['an import naming nothing', "<?php\nuse ;", false],
    ];
}

/**
 * Runs the cases and says which failed. A move rewrites hundreds of files at once, so the reading it is
 * built on is worth proving before it is trusted.
 */
function selfTest(): int
{
    $failed = 0;
    $ran = 0;

    $say = static function (bool $held, string $why, bool $want, bool $got): void {
        printf("  %s  %-48s %s\n", $held ? 'ok  ' : 'FAIL', $why, $held ? '' : sprintf('(wanted %s, got %s)', var_export($want, true), var_export($got, true)));
    };

    foreach (cases() as [$why, $code, $class, $want]) {
        $got = names("<?php\n".$code, $class);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        $say($got === $want, $why, $want, $got);
    }

    foreach (rewrites() as [$why, $body, $old, $new, $want]) {
        $got = renamed($body, $old, $new);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        printf("  %s  %-48s %s\n", $got === $want ? 'ok  ' : 'FAIL', $why, $got === $want ? '' : sprintf('(wanted %s, got %s)', var_export($want, true), var_export($got, true)));
    }

    foreach (repoints() as [$why, $body, $from, $onward, $want]) {
        $got = repointed($body, $from, $onward);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        printf("  %s  %-48s %s\n", $got === $want ? 'ok  ' : 'FAIL', $why, $got === $want ? '' : sprintf('(wanted %s, got %s)', var_export($want, true), var_export($got, true)));
    }

    foreach (destinations() as [$why, $from, $qualified, $want]) {
        $got = destination($from, $qualified);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        printf("  %s  %-48s %s\n", $got === $want ? 'ok  ' : 'FAIL', $why, $got === $want ? '' : sprintf('(wanted %s, got %s)', relative($want), relative($got)));
    }

    foreach (scopes() as [$why, $namespace, $root, $want]) {
        $got = isUnder($namespace, $root);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        $say($got === $want, $why, $want, $got);
    }

    foreach (naming() as [$why, $body, $qualified, $want]) {
        $got = namesClass($body, $qualified);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        $say($got === $want, $why, $want, $got);
    }

    foreach (duplicates() as [$why, $body, $want]) {
        $got = deduplicated($body);
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        printf("  %s  %-48s %s\n", $got === $want ? 'ok  ' : 'FAIL', $why, $got === $want ? '' : sprintf('(wanted %s, got %s)', var_export($want, true), var_export($got, true)));
    }

    foreach (parses() as [$why, $body, $want]) {
        $got = unparsable(['proving' => $body]) === [];
        $ran++;

        if ($got !== $want) {
            $failed++;
        }

        $say($got === $want, $why, $want, $got);
    }

    printf("\n%d of %d passed.\n", $ran - $failed, $ran);

    return $failed === 0 ? 0 : 1;
}

function usage(): int
{
    echo <<<'TEXT'
    Move or rename a class, with every reference to it.

      php tools/refactoring/move.php <Old> <New>
      php tools/refactoring/move.php <Old> <Namespace\New>
      php tools/refactoring/move.php --namespace=<From> <Into>
      php tools/refactoring/move.php --list=<file>

    Point every reference at a class that ALREADY EXISTS, then delete the one it
    replaced — a merge, for when two classes say the same thing and one is retiring:

      php tools/refactoring/move.php --replace <Old> <Kept>

    Add --dry-run to any of them to report without writing.

    TEXT;

    return 1;
}
