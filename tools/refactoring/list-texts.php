<?php

declare(strict_types=1);

/**
 * Lists every text a user reads on screen as "file:line<TAB>text" for review: a .vue template's text and label-like
 * attributes, label-like keys in .vue and .ts scripts, and what a PHP method named for a screen text returns.
 *
 *   php tools/refactoring/list-texts.php resources/js app
 *       prints every text.
 *   php tools/refactoring/list-texts.php --check docs/naming/reviewed-texts.txt resources/js app
 *       prints the texts not on the reviewed list and fails while there is one.
 *   php tools/refactoring/list-texts.php --accept docs/naming/reviewed-texts.txt resources/js app
 *       writes every current text to the reviewed list, after they were read and the odd ones rewritten.
 */

use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;

require dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/php-parse.php';

/**
 * One text a user reads, and where it is written.
 */
final readonly class ScreenText
{
    public function __construct(public string $text, public string $file, public int $line) {}

    /**
     * The line the reviewed list keeps: the text alone, so a text moved to another file stays reviewed.
     */
    public function reviewLine(): string
    {
        return $this->text;
    }
}

/**
 * The attributes and script keys whose value a user reads.
 */
const LABEL_KEYS = 'title|label|placeholder|aria-label|alt|description|heading|hint|message|summary|empty-text|confirm-label';

/**
 * PHP methods whose returned strings a user reads.
 */
const TEXT_METHODS = [
    'label',
    'labels',
    'description',
    'title',
    'heading',
    'summary',
    'placeholder',
    'hint',
    'messages',
];

$arguments = array_slice($argv, 1);
$mode = in_array($arguments[0] ?? null, ['--check', '--accept'], true) ? array_shift($arguments) : '--list';
$reviewedFile = $mode === '--list' ? '' : (string) array_shift($arguments);
$texts = screenTexts($arguments);
$current = array_values(array_unique(array_map(static fn (ScreenText $text) => $text->reviewLine(), $texts)));
sort($current);

if ($mode === '--list') {
    foreach ($texts as $text) {
        echo "{$text->file}:{$text->line}\t{$text->text}\n";
    }

    exit(0);
}

if ($mode === '--accept') {
    file_put_contents($reviewedFile, implode("\n", $current)."\n");
    echo count($current)." texts recorded as reviewed in {$reviewedFile}\n";

    exit(0);
}

$reviewed = is_file($reviewedFile) ? file($reviewedFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$unreviewed = array_values(array_diff($current, $reviewed ?: []));

if ($unreviewed === []) {
    echo 'All '.count($current)." screen texts were reviewed.\n";

    exit(0);
}

echo count($unreviewed).' screen texts were not reviewed yet; read each aloud, rewrite what a user would not say '
    ."(a label is the short word a dashboard shows, an explanation a plain sentence), then record them with --accept:\n";

foreach ($texts as $text) {
    if (in_array($text->reviewLine(), $unreviewed, true)) {
        echo "  {$text->text} ({$text->file}:{$text->line})\n";
        $unreviewed = array_values(array_diff($unreviewed, [$text->reviewLine()]));
    }
}

exit(1);

/**
 * @param  list<string>  $folders  folders or single files
 * @return list<ScreenText>
 */
function screenTexts(array $folders): array
{
    $texts = [];

    foreach ($folders as $folder) {
        $files = is_file($folder)
            ? [new SplFileInfo($folder)]
            : new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS));

        foreach ($files as $file) {
            $path = $file->getPathname();

            if (str_contains($path, '/generated/') || str_contains($path, '.test.') || str_contains($path, '/node_modules/')) {
                continue;
            }

            $found = match ($file->getExtension()) {
                'vue' => [
                    ...templateTexts($path),
                    ...scriptTexts($path),
                ],
                'ts' => scriptTexts($path),
                'php' => phpTexts($path),
                default => [],
            };
            array_push($texts, ...$found);
        }
    }

    usort($texts, static fn (ScreenText $a, ScreenText $b) => [
        $a->file,
        $a->line,
    ] <=> [
        $b->file,
        $b->line,
    ]);

    return $texts;
}

/**
 * The static text between a template's tags and the static values of its label-like attributes.
 *
 * @return list<ScreenText>
 */
function templateTexts(string $path): array
{
    $source = (string) file_get_contents($path);

    if (preg_match('/<template>(.*)<\/template>/s', $source, $template, PREG_OFFSET_CAPTURE) !== 1) {
        return [];
    }

    [$markup, $offset] = $template[1];
    $texts = [];
    preg_match_all('/>([^<>]+)</', $markup, $between, PREG_OFFSET_CAPTURE);

    foreach ($between[1] as [$text, $at]) {
        $texts[] = textAt($text, $path, $source, $offset + $at);
    }

    preg_match_all('/\s:?(?:'.LABEL_KEYS.')="(?:\'([^\'"]+)\'|([^"{}]+))"/', $markup, $attributes, PREG_OFFSET_CAPTURE);

    foreach ($attributes[0] as $index => [, $at]) {
        $value = $attributes[1][$index][0] !== '' ? $attributes[1][$index][0] : $attributes[2][$index][0];
        $bound = str_starts_with(ltrim($attributes[0][$index][0]), ':');
        $texts[] = $bound && $attributes[1][$index][0] === '' ? null : textAt($value, $path, $source, $offset + $at);
    }

    return array_values(array_filter($texts));
}

/**
 * A string a script gives to a label-like key, such as { title: 'Rename' }.
 *
 * @return list<ScreenText>
 */
function scriptTexts(string $path): array
{
    $source = (string) file_get_contents($path);
    $script = preg_match('/<script[^>]*>(.*?)<\/script>/s', $source, $match, PREG_OFFSET_CAPTURE) === 1
        ? $match[1]
        : [
            $source,
            0,
        ];
    [$code, $offset] = $script;
    preg_match_all('/\b(?:'.str_replace('-', '', LABEL_KEYS).')\s*:\s*([\'"`])((?:(?!\1).)+)\1/', $code, $keys, PREG_OFFSET_CAPTURE);
    $texts = [];

    foreach ($keys[2] as [$text, $at]) {
        $texts[] = textAt($text, $path, $source, $offset + $at);
    }

    return array_values(array_filter($texts));
}

/**
 * The strings a PHP method named for a screen text holds.
 *
 * @return list<ScreenText>
 */
function phpTexts(string $path): array
{
    $statements = parsedOnce($path, (string) file_get_contents($path));
    $finder = new NodeFinder();
    $texts = [];

    foreach ($finder->findInstanceOf($statements, ClassMethod::class) as $method) {
        if (! in_array($method->name->toLowerString(), TEXT_METHODS, true)) {
            continue;
        }

        foreach ($finder->findInstanceOf($method->stmts ?? [], String_::class) as $string) {
            $texts[] = readable($string->value) ? new ScreenText(oneLine($string->value), $path, $string->getStartLine()) : null;
        }
    }

    return array_values(array_filter($texts));
}

function textAt(string $text, string $path, string $source, int $offset): ScreenText|null
{
    $leading = strlen($text) - strlen(ltrim($text));
    $line = substr_count(substr($source, 0, $offset + $leading), "\n") + 1;

    if (readable($text)) {
        return new ScreenText(oneLine($text), $path, $line);
    }

    return null;
}

/**
 * Whether the text holds words a user reads, not only an expression, a code name or a single character.
 */
function readable(string $text): bool
{
    $words = trim((string) preg_replace('/\{\{.*?\}\}/s', '', $text));

    if (preg_match('/\p{L}{2,}/u', $words) !== 1) {
        return false;
    }

    return str_contains($words, ' ') || preg_match('/[._\/:()=]|^[a-z]+[A-Z]|^[a-z]+-[a-z-]+$/', $words) !== 1;
}

function oneLine(string $text): string
{
    return trim((string) preg_replace('/\s+/', ' ', $text));
}
