<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\InterpolatedStringPart;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;

/**
 * Every string, string part or heredoc of a file that names project code, such as 'App\Communication\Models\Message'.
 */
final class StringScan
{
    /**
     * @return list<NameUse>
     */
    public static function of(ParsedFile $file, ProjectRoots $roots): array
    {
        $uses = [];

        $finder = new NodeFinder();
        $strings = [
            ...$finder->findInstanceOf($file->statements, String_::class),
            ...$finder->findInstanceOf($file->statements, InterpolatedStringPart::class),
        ];

        foreach ($strings as $string) {
            if (! $roots->startsWithProjectNamespace($string->value)) {
                continue;
            }

            $uses[] = new NameUse(
                $file->path,
                $string->getStartLine(),
                ProjectRoots::withoutLeadingBackslash($string->value),
                NameType::String,
            );
        }

        return $uses;
    }
}
