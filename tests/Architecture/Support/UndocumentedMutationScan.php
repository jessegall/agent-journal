<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The public methods of a model's Mutations section whose doc comment is missing or runs past two lines of text, each
 * as Class::method; tag lines such as @param and @throws are not counted.
 *
 * @implements FileScan<string>
 */
final readonly class UndocumentedMutationScan implements FileScan
{
    private const int MOST_LINES = 2;

    public function key(): string
    {
        return 'undocumented-mutations-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $undocumented = [];
        $sections = ModelSections::of($file->code);

        foreach (new NodeFinder()->findInstanceOf($file->statements, Class_::class) as $class) {
            foreach ($class->getMethods() as $method) {
                if ($class->name === null || ! $method->isPublic() || ! $sections->isMutation($method)) {
                    continue;
                }

                $lines = $this->textLinesOf((string) $method->getDocComment()?->getText());

                if ($lines === 0 || $lines > self::MOST_LINES) {
                    $undocumented[] = $class->name->toString().'::'.$method->name->toString();
                }
            }
        }

        return $undocumented;
    }

    /**
     * How many lines of text the doc comment holds before its first tag.
     */
    private function textLinesOf(string $comment): int
    {
        $lines = 0;

        foreach (explode("\n", $comment) as $line) {
            $text = trim(preg_replace('/^\s*(\/\*\*|\*\/|\*)/', '', $line) ?? '');
            $text = trim(preg_replace('/\*\/$/', '', $text) ?? '');

            if (str_starts_with($text, '@')) {
                break;
            }

            if ($text !== '') {
                $lines++;
            }
        }

        return $lines;
    }
}
